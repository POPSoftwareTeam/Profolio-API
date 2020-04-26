import { User } from "../Models/UserModel";
import { IUserRepository } from "../Repositories/IUserRepository";
import {IUserService} from "./IUserService";

export class UserService implements IUserService {
    public iuserrepository: IUserRepository;
    constructor(iuserrepository: IUserRepository) {
        this.iuserrepository = iuserrepository;
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
