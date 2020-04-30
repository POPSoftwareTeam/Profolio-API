import { User } from "../../Models/UserModel";

export interface IPhotoService{
    GetFullResPhoto(photoID: string,user: User): any;
}