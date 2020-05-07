import { User } from "../../Models/UserModel";

export interface IClientService{
    getAllPhotosSharedWithClient(user:User):Promise<[string]>
}