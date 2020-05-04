import { User } from "../../Models/UserModel";

export interface IPhotoService{
    GetFullResPhoto(photoID: string,user: User): any;
    GetLowResPhoto(photoID: string,user: User): any;
    UploadPhoto(photo: any, user: User):any;
    GetUserPhotos(user:User):Promise<[string]>
}