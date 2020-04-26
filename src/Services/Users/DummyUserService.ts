import { User } from "../../Models/UserModel";
import { IUserRepository } from "../../Repositories/IUserRepository";
import {IUserService} from "./IUserService";
import { promises } from "fs";

export class DummyUserService implements IUserService {
    constructor(iuserrepository: IUserRepository) {
    }
    EmailVerification(code: string): Promise<boolean> {
        if(code == "12345"){
            return Promise.resolve(true);
        }else{
            return Promise.resolve(false);
        }
    }
    ValidateUser(user: User): Promise<User> {
        if (user.email == "kyler.daybell@gmail.com" && user.password == "kyler" && user.authorization == "admin") {
            return Promise.resolve(new User(0,"kyler.daybell@gmail.com","kyler","admin"));
        }
    }
    public async RemoveUser(user: User): Promise<boolean> {
        return true;
    }
    public async CreateUser(user: User): Promise<boolean> {
        return true;
    }
    public async GetUserByEmail(user: User): Promise<User> {
        throw new Error("Method not implemented.");
    }

}