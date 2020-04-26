import {User} from "../Models/UserModel";

export interface IUserRepository {
    AddNewUser(user: User,guid:string): Promise<boolean>;
    GetExsistingUser(user: User): Promise<User>;
    RemoveUser(user: User): Promise<boolean>;
    VerifyEmail(guid:string,level:string): Promise<boolean>;
}
