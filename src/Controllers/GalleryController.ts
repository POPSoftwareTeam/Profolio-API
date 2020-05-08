import { Request, Response } from "express";
import { ILoggerService } from "../Services/Logging/ILoggerService";
import { IAuthenticationService } from "../Services/Authentication/IAuthenticationService";
import { User } from "../Models/UserModel";
import {Gallery} from "../Models/GalleryModel";
import { IGalleryService } from "../Services/Gallery/IGalleryService";


export class GalleryController{
    readonly iloggerservice:ILoggerService
    readonly iauthenticationservice:IAuthenticationService;
    readonly igalleryservice:IGalleryService;

    constructor(iloggerservice:ILoggerService,iauthenticationservice:IAuthenticationService,igalleryservice:IGalleryService){
        this.iloggerservice = iloggerservice;
        this.iauthenticationservice = iauthenticationservice;
        this.igalleryservice = igalleryservice;
    }

    public async CreateGallery(req:Request,res:Response){
        this.iloggerservice.log("IP:"+req.connection.remoteAddress+" Controller: Photographer Function: CreateGallery Time:"+Date.now());
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        let gallery = new Gallery(0,req.body.Gallery.Name,req.body.Gallery.Description);
        for(let i in req.body.Gallery.Photos){
            gallery.AddPhoto(req.body.Gallery.Photos[i]);
        }
        if(user && gallery){
            let result = await this.igalleryservice.CreateGallery(gallery,user)
            if(result){
                res.write(JSON.stringify({Status: "success", Message: "The gallery was added"}));
                res.end();
            }else{
                res.write(JSON.stringify({Status: "failure", Message: "failed to add the gallery"}));
                res.end();
            }
            
        }
    }
}