import { User } from "../Models/UserModel";

export interface IPhotoRepository{
    CreatePhoto(title:string,guid:string,User:User):Promise<boolean>
    GetPhotosByUser(user:User):Promise<[string]>
    GetOwnerEmailByPhoto(guid:string):Promise<string>
    AddViewingPermissions(clientID:number,guid:string,permission:string):Promise<Boolean>
    GetPhotoIDByFILENAME(guid:string):Promise<string>
    getAllPhotosSharedWithClient(email:string):Promise<[string]>
}