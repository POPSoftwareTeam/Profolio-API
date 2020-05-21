import { User } from "../../Models/UserModel";

export interface IPhotoService{
    GetFullResPhoto(photoID: string,user: User): any;
    GetLowResPhoto(photoID: string,user: User): any;
    UploadPhoto(photo: any, user: User):any;
    DeletePhoto(user:User,photoID:string):Promise<boolean>
    GrantClientPermissions(clientEmail:string,photoID:string,permission:string,owner:User):Promise<boolean>
    GetUserPhotos(user: User): Promise<[string]>
    getAllPhotosSharedWithClient(user:User):Promise<[string]>
    GetUserAvailablePhotoCount(user:User):Promise<number>
}