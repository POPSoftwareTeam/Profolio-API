import { User } from "../Models/UserModel";

export interface IPhotoRepository{
    CreatePhoto(title:string,guid:string,User:User):Promise<boolean>
    GetPhotosByUser(user:User):Promise<[string]>
}