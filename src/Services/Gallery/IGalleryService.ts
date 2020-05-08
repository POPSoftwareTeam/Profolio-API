import { User } from "../../Models/UserModel";
import { Gallery } from "../../Models/GalleryModel";

export interface IGalleryService{
    CreateGallery(gallery:Gallery,user:User):Promise<boolean>
}