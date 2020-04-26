import { User } from "../../Models/UserModel";
import { IUserRepository } from "../../Repositories/IUserRepository";
import {IUserService} from "./IUserService";
import { IMailerService } from "../Email/IMailerService";

export class UserService implements IUserService {
    iuserrepository: IUserRepository;
    imailservice: IMailerService
    constructor(iuserrepository: IUserRepository,imailservice:IMailerService) {
        this.iuserrepository = iuserrepository;
        this.imailservice = imailservice;
    }
    public async EmailVerification(code: string): Promise<boolean> {
        return Promise.resolve(true);
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
    public async CreateUser(user: User): Promise<boolean> {
        const sercureuser = user.HashPassword();
        const result: boolean =  await this.iuserrepository.AddNewUser(sercureuser);
        if (result) {
            if(await this.imailservice.SendRegistrationEmail(user.email)){
                return true;
            }else{
                return false;
            }
        } else {
            return false;
        }
    }
    public async GetUserByEmail(user: User): Promise<User> {
        const DBUser = await this.iuserrepository.GetExsistingUser(user);
        return DBUser;
    }
}
