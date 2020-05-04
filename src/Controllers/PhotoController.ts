import { Request, Response } from "express";
import { User } from "../Models/UserModel";
import { IAuthenticationService } from "../Services/Authentication/IAuthenticationService";
import { IPhotoService } from "../Services/Photo/IPhotoService";
const fs = require('fs');

export class PhotoController{
    readonly iauthenticationservice: IAuthenticationService;
    readonly iphotoservice: IPhotoService;
    constructor(iauthenticationservice:IAuthenticationService,iphotoservice:IPhotoService){
        this.iauthenticationservice = iauthenticationservice;
        this.iphotoservice = iphotoservice
    }
    public async GetFullResPhoto(req: Request,res:Response){
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        if(user){
            let photo = await this.iphotoservice.GetFullResPhoto(req.params.PhotoID,user);
            if(photo){
                res.writeHead(200, {'Content-Type': 'image/jpeg'});
                res.end(photo);
                return
            }else{
                res.sendStatus(403);
            }
        }
    }
    public async GetLowResPhoto(req: Request,res:Response){
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        if(user){
            let photo = await this.iphotoservice.GetLowResPhoto(req.params.PhotoID,user);
            if(photo){
                res.writeHead(200, {'Content-Type': 'image/jpeg'});
                res.end(photo);
                return
            }else{
                res.sendStatus(403);
            }
        }
        
    }

    public async UploadPhoto(req:any,res:Response){
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        if(user){
            try{
                let buffer = req.file.buffer
                const data = new Uint8Array(buffer)
                await this.iphotoservice.UploadPhoto(data,user)
                res.write(JSON.stringify({Status: "success"}));
                res.end();
            }catch(e){
                res.write(JSON.stringify({Status: "failure"}));
                res.end();
            }
        }
    }

    public async GetUserPhotos(req:Request,res:Response){
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        if(user){
            let photos = await this.iphotoservice.GetUserPhotos(user)
            res.write(JSON.stringify({Status: "success", Data: photos}));
            res.end();
        }
    }
}