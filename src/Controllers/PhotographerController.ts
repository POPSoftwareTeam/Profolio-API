import { Request, Response } from "express";
import { ILoggerService } from "../Services/Logging/ILoggerService";
import { IAuthenticationService } from "../Services/Authentication/IAuthenticationService";
import { IPhotographerService } from "../Services/Photographer/IPhotographerService";
import { User } from "../Models/UserModel";

export class PhotographerController{
    readonly iloggerservice:ILoggerService
    readonly iauthenticationservice:IAuthenticationService;
    readonly iphotographerservice:IPhotographerService;

    constructor(iloggerservice:ILoggerService,iauthenticationservice:IAuthenticationService,iphotographerservice:IPhotographerService){
        this.iloggerservice = iloggerservice;
        this.iauthenticationservice = iauthenticationservice;
        this.iphotographerservice = iphotographerservice;
    }
    public async GrantClientPermission(req:Request,res:Response){
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        let clientEmail = req.body.Email;
        let photoID = req.body.Photo;
        let permission = req.body.Permission;
        if(user && clientEmail && photoID && permission){
            let result = await this.iphotographerservice.GrantClientPermissions(clientEmail,photoID,permission,user)

        }
    }
}