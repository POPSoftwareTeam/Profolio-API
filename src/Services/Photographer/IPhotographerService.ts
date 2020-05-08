import { User } from "../../Models/UserModel";
import { Gallery } from "../../Models/GalleryModel";

export interface IPhotographerService{
    GrantClientPermissions(clientEmail:string,photoID:string,permission:string,owner:User):Promise<boolean>
    GetUserPhotos(user: User): Promise<[string]>
    CreateGallery(gallery:Gallery,user:User):Promise<boolean>
}