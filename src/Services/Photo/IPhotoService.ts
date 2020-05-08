import { User } from "../../Models/UserModel";

export interface IPhotoService{
    GetFullResPhoto(photoID: string,user: User): any;
    GetLowResPhoto(photoID: string,user: User): any;
    UploadPhoto(photo: any, user: User):any;
    DeletePhoto(user:User,photoID:string):Promise<boolean>
}