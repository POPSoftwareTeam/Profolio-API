import { Request, Response } from "express";
import { User } from "../Models/UserModel";
import { IAuthenticationService } from "../Services/Authentication/IAuthenticationService";
import { ILoggerService } from "../Services/Logging/ILoggerService";
import { IClientService } from "../Services/Client/IClientService";

export class ClientController{
    readonly iauthenticationservice: IAuthenticationService;
    readonly iclientservice: IClientService;
    readonly iloggerservice: ILoggerService
    constructor(iloggerservice:ILoggerService,iauthenticationservice:IAuthenticationService,iclientservice:IClientService){
        this.iauthenticationservice = iauthenticationservice;
        this.iclientservice = iclientservice
        this.iloggerservice = iloggerservice
    }
    public async GetAllSharedClientPhotos(req:Request,res:Response){
        this.iloggerservice.log("IP:"+req.connection.remoteAddress+" Controller: Client Function: GetAllSharedClientPhotos Time:"+Date.now());
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        if(user){
            let photos = await this.iclientservice.getAllPhotosSharedWithClient(user);
            res.write(JSON.stringify({Status: "success", Data: photos}));
            res.end();
        }
    }
}