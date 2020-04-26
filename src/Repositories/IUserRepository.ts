import {User} from "../Models/UserModel";

export interface IUserRepository {
    AddNewUser(user: User): Promise<boolean>;
    GetExsistingUser(user: User): Promise<User>;
    RemoveUser(user: User): Promise<boolean>;
}
