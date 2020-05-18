import { Request, Response } from "express";
import { User } from "../Models/UserModel";
import { IAuthenticationService } from "../Services/Authentication/IAuthenticationService";
import { IPhotoService } from "../Services/Photo/IPhotoService";
import { ILoggerService } from "../Services/Logging/ILoggerService";


export class PhotoController{
    readonly iauthenticationservice: IAuthenticationService;
    readonly iphotoservice: IPhotoService;
    readonly iloggerservice: ILoggerService
    constructor(iloggerservice:ILoggerService,iauthenticationservice:IAuthenticationService,iphotoservice:IPhotoService){
        this.iauthenticationservice = iauthenticationservice;
        this.iphotoservice = iphotoservice
        this.iloggerservice = iloggerservice
    }
    public async GetFullResPhoto(req: Request,res:Response){
        this.iloggerservice.log("IP:"+req.connection.remoteAddress+" Controller: Photo Function: GetFullResPhoto Time:"+Date.now());
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
        this.iloggerservice.log("IP:"+req.connection.remoteAddress+" Controller: Photo Function: GetLowResPhoto Time:"+Date.now());
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

    public async GrantClientPermission(req:Request,res:Response){
        this.iloggerservice.log("IP:"+req.connection.remoteAddress+" Controller: Photographer Function: GrantClientPermission Time:"+Date.now());
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        let clientEmail = req.body.Email;
        let photoID = req.body.Photo;
        let permission = req.body.Permission;
        if(user && clientEmail && photoID && permission){
            console.log("in the permissions")
            let result = await this.iphotoservice.GrantClientPermissions(clientEmail,photoID,permission,user)
            if(result){
                res.write(JSON.stringify({Status: "success", Message: "The client now has permission to view the photo"}));
                res.end();
            }else{
                res.write(JSON.stringify({Status: "failure", Message: "failed to add permissions"}));
                res.end();
            }

        }
    }

    public async GetAllSharedClientPhotos(req:Request,res:Response){
        this.iloggerservice.log("IP:"+req.connection.remoteAddress+" Controller: Client Function: GetAllSharedClientPhotos Time:"+Date.now());
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        if(user){
            let photos = await this.iphotoservice.getAllPhotosSharedWithClient(user);
            res.write(JSON.stringify({Status: "success", Data: photos}));
            res.end();
        }
    }


    public async GetUserPhotos(req:Request,res:Response){
        this.iloggerservice.log("IP:"+req.connection.remoteAddress+" Controller: Photographer Function: GetUserPhotos Time:"+Date.now());
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        if(user){
            let photos = await this.iphotoservice.GetUserPhotos(user)
            res.write(JSON.stringify({Status: "success", Data: photos}));
            res.end();
        }
    }

    public async UploadPhoto(req:any,res:Response){
        this.iloggerservice.log("IP:"+req.connection.remoteAddress+" Controller: Photo Function: UploadPhoto Time:"+Date.now());
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        if(user){
            try{
                let buffer = req.file.buffer
                const data = new Uint8Array(buffer)
                await this.iphotoservice.UploadPhoto(data,user)
                res.write(JSON.stringify({Status: "success",Message:"the photo was successfully uploaded"}));
                res.end();
            }catch(e){
                this.iloggerservice.error("IP:"+req.connection.remoteAddress+" Controller: Photo Function: UploadPhoto Time:"+Date.now()+"Error:"+e)
                res.write(JSON.stringify({Status: "failure"}));
                res.end();
            }
        }
    }
    public async DeletePhoto(req:Request,res:Response){
        this.iloggerservice.log("IP:"+req.connection.remoteAddress+" Controller: Photo Function: UploadPhoto Time:"+Date.now());
        let user:User = await  this.iauthenticationservice.AuthenticateToken(req,res);
        let photoID = req.params.PhotoID
        if(user && photoID){
            let result = await this.iphotoservice.DeletePhoto(user,photoID);
            if(result){
                res.write(JSON.stringify({Status: "success",Message:"the photo was successfully deleted"}));
                res.end();
            }else{
                res.write(JSON.stringify({Status: "failure",Message:"the photo was not"}));
                res.end();
            }
        }
    }
}