import { IPhotoService } from "./IPhotoService";
import { IFileService } from "../FileService/IFileService";
import { User } from "../../Models/UserModel";
import { v1 as uuidv1 } from 'uuid';
import { IPhotoRepository } from "../../Repositories/IPhotoRepository";
import { IUserRepository } from "../../Repositories/IUserRepository";
import { ILoggerService } from "../Logging/ILoggerService";


export class DummyPhotoService implements IPhotoService{
    private readonly ifileservice:IFileService;
    private readonly iphotorepository: IPhotoRepository;
    private readonly iuserrepository:IUserRepository;
    private readonly iloggerservice:ILoggerService
    constructor(iloggerservice:ILoggerService,ifileservice:IFileService,iphotorepository:IPhotoRepository,iuserrepository:IUserRepository){
        this.ifileservice = ifileservice
        this.iphotorepository = iphotorepository;
        this.iuserrepository = iuserrepository;
        this.iloggerservice = iloggerservice;
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
    public async DeletePhoto(user: User, photoID: string): Promise<boolean> {
        let guid = photoID.split(".")[0]
        let DBUserEmail = await this.iphotorepository.GetOwnerEmailByPhoto(guid)
        if(user.email == DBUserEmail){
            await this.iphotorepository.DeletePhoto(guid);
            this.ifileservice.DeleteImage(photoID);
        }else{
            return false
        }
    }

    public async GrantClientPermissions(clientEmail: string, photoID: string,permission:"Full_Res"|"Low_Res", owner: User): Promise<boolean> {
        let guid = photoID.split(".")[0]
        let DBOwnwerEmail = await this.iphotorepository.GetOwnerEmailByPhoto(guid)
        if(DBOwnwerEmail == owner.email){
            let clientUser = new User(0,clientEmail,"","unverified");
            let DBClientUser = await this.iuserrepository.GetExistingUser(clientUser);
            if(DBClientUser.authorization != "unverified"){
                let result = await this.iphotorepository.AddViewingPermissions(DBClientUser.id,guid,permission);
                if(result){
                    return true;
                }
            }

        }

        return false;
    }

    public async GetUserPhotos(user: User): Promise<[string]> {
        return await this.iphotorepository.GetPhotosByUser(user);
    }

    public async getAllPhotosSharedWithClient(user:User): Promise<[string]> {
        try{
            return await this.iphotorepository.GetAllPhotosSharedWithClient(user.email)
        }catch(error){
            this.iloggerservice.error("Service: ClientService, Function:GetPhotosSharedWithClientByEmail, Error:"+error)
            return [""]
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