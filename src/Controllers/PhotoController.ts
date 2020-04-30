import { Request, Response } from "express";
import { User } from "../Models/UserModel";
import { IAuthenticationService } from "../Services/Authentication/IAuthenticationService";
import { IPhotoService } from "../Services/PhotoService/IPhotoService";

export class PhotoController{
    readonly iauthenticationservice: IAuthenticationService;
    readonly iphotoservice: IPhotoService;
    constructor(iauthenticationservice:IAuthenticationService,iphotoservice:IPhotoService){
        this.iauthenticationservice = iauthenticationservice;
        this.iphotoservice = iphotoservice
    }
    public async GetFullPhoto(req: Request,res:Response){
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        if(user){
            console.log(req.params.PhotoID);
            let photo = await this.iphotoservice.GetFullResPhoto(req.params.PhotoID,user);
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(photo);
        }
    }
}