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
        let permission = await this.UserHasPhotoAccess(photoID,user.email);
        if(permission == "Full_Res"|| permission == "Low_Res"){
            return await this.ifileservice.GetLowResImage(photoID);
        }else{
            return null;
        }
    }
    public async GetFullResPhoto(photoID: string, user: any) {
        let permission = await this.UserHasPhotoAccess(photoID,user.email);
        if(permission == "Full_Res"){
            return await this.ifileservice.GetFullResImage(photoID);
        }else{
            return null;
        }
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

    private async UserHasPhotoAccess(photoID:string,email:string):Promise<"Low_Res"|"Full_Res"|"No_Access">{
        let guid = photoID.split(".")[0]
        let DBUserEmail = await this.iphotorepository.GetOwnerEmailByPhoto(guid)
        //if the person is the owner of the photo
        if(email == DBUserEmail){
            return "Full_Res";
        }else{
            //if the person has been granted access to the photo by the photo owner.
            let Shared = await this.iphotorepository.IsPhotoSharedWithClient(guid,email)
            return Shared;
        }
    }

}