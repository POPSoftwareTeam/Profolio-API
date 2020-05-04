import { User } from "../../Models/UserModel";

export interface IPhotographerService{
    GrantClientPermissions(clientEmail:string,photoID:string,permission:string,owner:User):Promise<boolean>
}