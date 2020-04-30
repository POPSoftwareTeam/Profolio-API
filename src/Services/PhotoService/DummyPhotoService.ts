import { IPhotoService } from "./IPhotoService";
import { IFileService } from "../FileService/IFileService";
import { User } from "../../Models/UserModel";
import { v1 as uuidv1 } from 'uuid';


export class DummyPhotoService implements IPhotoService{
    readonly ifileservice:IFileService;
    constructor(ifileservice:IFileService){
        this.ifileservice = ifileservice
    }
    public async GetLowResPhoto(photoID: string, user: User) {
        await this.ifileservice.CreateLowResImage(photoID);
        let FullResPhoto = await this.ifileservice.GetLowResImage(photoID);
    }
    public async GetFullResPhoto(photoID: string, user: any) {
        return await this.ifileservice.GetFullResImage(photoID);
    }
    
    public async UploadPhoto(photo: any, user: User) {
        try{
            const guid = uuidv1()
            await this.ifileservice.CreateImage(photo,guid);
            return true;
        }catch(e){
            return false
        }
        
    }
}