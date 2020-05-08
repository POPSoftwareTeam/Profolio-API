import { Gallery } from "../Models/GalleryModel";
import { User } from "../Models/UserModel";



export interface IGalleryRepository{
    CreateGallery(gallery:Gallery,user:User):Promise<boolean>;
}