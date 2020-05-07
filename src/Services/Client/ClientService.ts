import { IClientService } from "./IClientService";
import { ILoggerService } from "../Logging/ILoggerService";
import { IPhotoRepository } from "../../Repositories/IPhotoRepository";
import { IUserRepository } from "../../Repositories/IUserRepository";
import { User } from "../../Models/UserModel";

export class ClientService implements IClientService{
    private readonly iloggerservice:ILoggerService;
    private readonly iphotorepository:IPhotoRepository;
    private readonly iuserrepository:IUserRepository;

    constructor(iloggerservice:ILoggerService,iphotorepository:IPhotoRepository,iuserrepository:IUserRepository){
        this.iloggerservice = iloggerservice;
        this.iuserrepository = iuserrepository;
        this.iphotorepository = iphotorepository;
    }
    public async getAllPhotosSharedWithClient(user:User): Promise<[string]> {
        try{
            return await this.iphotorepository.getAllPhotosSharedWithClient(user.email)
        }catch(error){
            this.iloggerservice.error("Service: ClientService, Function:GetPhotosSharedWithClientByEmail, Error:"+error)
            return [""]
        }
    }

}