import {IPhotographerService} from "./IPhotographerService"
import { User } from "../../Models/UserModel";
import { ILoggerService } from "../Logging/ILoggerService";
import { IPhotoRepository } from "../../Repositories/IPhotoRepository";
import { IUserRepository } from "../../Repositories/IUserRepository";


export class PhotographerService implements IPhotographerService{
    readonly iloggerservice:ILoggerService;
    readonly iphotorepository:IPhotoRepository;
    readonly iuserrepository:IUserRepository
    constructor(iloggerservice:ILoggerService,iphotorepository:IPhotoRepository,iuserrepository:IUserRepository){
        this.iloggerservice = iloggerservice;
        this.iphotorepository = iphotorepository;
        this.iuserrepository = iuserrepository;
    }
    public async GrantClientPermissions(clientEmail: string, photoID: string,permission:string, owner: User): Promise<boolean> {
        let guid = photoID.split(".")[0]
        let DBOwnwerEmail = await this.iphotorepository.GetOwnerEmailByPhoto(guid)
        if(DBOwnwerEmail == owner.email){
            let clientUser = new User(0,clientEmail,"","unverified");
            let DBClientUser = await this.iuserrepository.GetExistingUser(clientUser);
            if(DBClientUser.authorization != "unverified"){
                let result = await this.iphotorepository.AddViewingPermissions(DBClientUser.id,guid,permission);
                return true;
            }

        }

        return false;
    }

}