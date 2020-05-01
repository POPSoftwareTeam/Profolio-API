import { User } from "../Models/UserModel";

export interface IPhotoRepository{
    CreatePhoto(guid:string,User:User):Promise<boolean>
}