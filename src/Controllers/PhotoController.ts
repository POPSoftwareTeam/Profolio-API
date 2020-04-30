import { Request, Response } from "express";
import { User } from "../Models/UserModel";
import { IAuthenticationService } from "../Services/Authentication/IAuthenticationService";
import { IPhotoService } from "../Services/PhotoService/IPhotoService";
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
            console.log(req.params.PhotoID);
            let photo = await this.iphotoservice.GetFullResPhoto(req.params.PhotoID,user);
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(photo);
        }
    }
    public async GetLowResPhoto(req: Request,res:Response){
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        if(user){
            console.log(req.params.PhotoID);
            let photo = await this.iphotoservice.GetLowResPhoto(req.params.PhotoID,user);
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(photo);
        }
    }

    public async UploadPhoto(req:any,res:Response){
        //let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        let user = new User(0,"kyler.daybell96@gmail.com","","photographer")
        if(user){
            let buffer = req.file.buffer
            const data = new Uint8Array(buffer)
            this.iphotoservice.UploadPhoto(data,user)
        }
    }
}