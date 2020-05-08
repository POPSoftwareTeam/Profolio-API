import {IPhotographerService} from "./IPhotographerService"
import { User } from "../../Models/UserModel";
import { ILoggerService } from "../Logging/ILoggerService";
import { IPhotoRepository } from "../../Repositories/IPhotoRepository";
import { IUserRepository } from "../../Repositories/IUserRepository";
import { Gallery } from "../../Models/GalleryModel";
import { IGalleryRepository } from "../../Repositories/IGalleryRepository";


export class PhotographerService implements IPhotographerService{
    private readonly iloggerservice:ILoggerService;
    private readonly iphotorepository:IPhotoRepository;
    private readonly iuserrepository:IUserRepository;
    private readonly igalleryrepository:IGalleryRepository;
    constructor(iloggerservice:ILoggerService,iphotorepository:IPhotoRepository,iuserrepository:IUserRepository,igalleryrepository:IGalleryRepository){
        this.iloggerservice = iloggerservice;
        this.iphotorepository = iphotorepository;
        this.iuserrepository = iuserrepository;
        this.igalleryrepository = igalleryrepository;
    }
    public async GrantClientPermissions(clientEmail: string, photoID: string,permission:string, owner: User): Promise<boolean> {
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

    public async CreateGallery(gallery: Gallery,user:User): Promise<boolean> {
        try{
            let DBUser = await this.iuserrepository.GetExistingUser(user);
            return await this.igalleryrepository.CreateGallery(gallery,DBUser);
        }catch(error){
            return false;
        }
    }

}