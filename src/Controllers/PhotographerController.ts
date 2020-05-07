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
        this.iloggerservice.log("IP:"+req.connection.remoteAddress+" Controller: Photographer Function: GrantClientPermission Time:"+Date.now());
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        let clientEmail = req.body.Email;
        let photoID = req.body.Photo;
        let permission = req.body.Permission;
        if(user && clientEmail && photoID && permission){
            let result = await this.iphotographerservice.GrantClientPermissions(clientEmail,photoID,permission,user)

        }
    }
    public async GetUserPhotos(req:Request,res:Response){
        this.iloggerservice.log("IP:"+req.connection.remoteAddress+" Controller: Photographer Function: GetUserPhotos Time:"+Date.now());
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        if(user){
            let photos = await this.iphotographerservice.GetUserPhotos(user)
            res.write(JSON.stringify({Status: "success", Data: photos}));
            res.end();
        }
    }
}