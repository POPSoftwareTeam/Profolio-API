import { IGalleryService } from "./IGalleryService";
import { User } from "../../Models/UserModel";
import { ILoggerService } from "../Logging/ILoggerService";
import { IPhotoRepository } from "../../Repositories/IPhotoRepository";
import { IUserRepository } from "../../Repositories/IUserRepository";
import { Gallery } from "../../Models/GalleryModel";
import { IGalleryRepository } from "../../Repositories/IGalleryRepository";


export class GalleryService implements IGalleryService{
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
    public async CreateGallery(gallery: Gallery,user:User): Promise<boolean> {
        try{
            let DBUser = await this.iuserrepository.GetExistingUser(user);
            return await this.igalleryrepository.CreateGallery(gallery,DBUser);
        }catch(error){
            return false;
        }
    }

}