import { User } from "../../Models/UserModel";
import { IUserRepository } from "../../Repositories/IUserRepository";
import {IUserService} from "./IUserService";
import { IMailerService } from "../Email/IMailerService";
import { v1 as uuidv1 } from 'uuid';

export class UserService implements IUserService {
    iuserrepository: IUserRepository;
    imailservice: IMailerService
    constructor(iuserrepository: IUserRepository,imailservice:IMailerService) {
        this.iuserrepository = iuserrepository;
        this.imailservice = imailservice;
    }
    public async VerifyClientEmail(guid: string): Promise<boolean> {
        try{
            this.iuserrepository.VerifyEmail(guid,"client");
            return true;
        }catch(e){
            return false
        }
    }
    public async VerifyPhotographerEmail(guid: string): Promise<boolean> {
        try{
            this.iuserrepository.VerifyEmail(guid,"photographer");
            return true;
        }catch(e){
            return false
        }
    }
    public async ValidateUser(user: User): Promise<User|null> {
        const DBUser: User = await this.iuserrepository.GetExsistingUser(user);
        if (DBUser.email !== "void" && DBUser.ValidatePassword(user.password)) {
            return DBUser;
        } else {
            return null;
        }
    }
    public async RemoveUser(user: User): Promise<boolean> {
        const DBUser = await this.iuserrepository.GetExsistingUser(user);
        if (DBUser.email !== "void") {
            const result = this.iuserrepository.RemoveUser(DBUser);
            if (result) {
                return true;
            }
        }
        return false;
    }
    public async CreateUser(user: User,level: string): Promise<boolean> {
        const sercureuser = user.HashPassword();
        const guid = uuidv1()
        const result: boolean =  await this.iuserrepository.AddNewUser(sercureuser,guid);
        let emailsent = false
        if(level == "client"){
            emailsent = await this.imailservice.SendClientRegistrationEmail(user.email,guid)
        }else{
            emailsent = await this.imailservice.SendPhotographerRegistrationEmail(user.email,guid)
        }
        if (result && emailsent) {
            return true;
        } else {
            return false;
        }
    }
    public async GetUserByEmail(user: User): Promise<User> {
        const DBUser = await this.iuserrepository.GetExsistingUser(user);
        return DBUser;
    }
}
