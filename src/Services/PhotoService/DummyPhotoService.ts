import { IPhotoService } from "./IPhotoService";
import { IFileService } from "../FileService/IFileService";
import { User } from "../../Models/UserModel";
import { v1 as uuidv1 } from 'uuid';
import { IPhotoRepository } from "../../Repositories/IPhotoRepository";


export class DummyPhotoService implements IPhotoService{
    readonly ifileservice:IFileService;
    readonly iphotorepository: IPhotoRepository;
    constructor(ifileservice:IFileService,iphotorepository:IPhotoRepository){
        this.ifileservice = ifileservice
        this.iphotorepository = iphotorepository;
    }
    public async GetLowResPhoto(photoID: string, user: User) {
        return await this.ifileservice.GetLowResImage(photoID);
    }
    public async GetFullResPhoto(photoID: string, user: any) {
        return await this.ifileservice.GetFullResImage(photoID);
    }
    
    public async UploadPhoto(photo: any, user: User) {
        try{
            const guid = uuidv1()
            await this.ifileservice.CreateImage(photo,guid);
            await this.iphotorepository.CreatePhoto("asdf",guid,user);
            return true;
        }catch(e){
            return false
        }
        
    }
    public async GetUserPhotos(user: User): Promise<[string]> {
        return await this.iphotorepository.GetPhotosByUser(user);
    }
}