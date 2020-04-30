import { IPhotoService } from "./IPhotoService";
import { IFileService } from "../FileService/IFileService";

export class DummyPhotoService implements IPhotoService{
    readonly ifileservice:IFileService;
    constructor(ifileservice:IFileService){
        this.ifileservice = ifileservice
    }
    public async GetFullResPhoto(photoID: string, user: any) {
        return await this.ifileservice.GetImage(photoID);
    }

}