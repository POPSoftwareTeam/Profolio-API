import { User } from "../Models/UserModel";

export interface IPhotoRepository{
    CreatePhoto(title:string,guid:string,User:User):Promise<boolean>
    GetPhotosByUser(user:User):Promise<[string]>
    GetOwnerEmailByPhoto(guid:string):Promise<string>
    AddViewingPermissions(clientID:number,guid:string,permission:string):Promise<Boolean>
    GetPhotoIDByFILENAME(guid:string):Promise<string>
    GetAllPhotosSharedWithClient(email:string):Promise<[string]>
    IsPhotoSharedWithClient(guid: string, email:string):Promise<"Low_Res"|"Full_Res"|"No_Access">
    DeletePhoto(guid:string):Promise<Boolean>
}