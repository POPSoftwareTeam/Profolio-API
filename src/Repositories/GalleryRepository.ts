import { IGalleryRepository } from "./IGalleryRepository";
import { Gallery } from "../Models/GalleryModel";
import { ILoggerService } from "../Services/Logging/ILoggerService";
import { User } from "../Models/UserModel";
const mysql2 = require("mysql2/promise");


export class GalleryRepository implements IGalleryRepository{
    private readonly iloggerservice:ILoggerService
    constructor(iloggerservice:ILoggerService){
        this.iloggerservice = iloggerservice
    }
    private async getConnection() {
        const con = await mysql2.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            
        });
        return con;
    }
    public async CreateGallery(gallery: Gallery,user : User): Promise<boolean> {
        let con = await this.getConnection()
        try{
            let [rows] = await con.execute("INSERT INTO GALLERY (OWNER_ID,NAME,DESCRIPTION) VALUES (?,?,?)",[user.id,gallery.name,gallery.description])
            for(let i in gallery.photos){
                let guid = gallery.photos[i].split(".")[0]
                let [rows] = await con.execute("INSERT INTO GALLERY_PHOTO (GALLERY_ID,PHOTO_ID) VALUES ((SELECT ID FROM GALLERY WHERE OWNER_ID = ? AND NAME = ?),(SELECT PHOTO.ID FROM PHOTO WHERE PHOTO.FILENAME = ?))",[user.id,gallery.name,guid])
            }
            return true
        }catch(error){
            this.iloggerservice.error(error);
            return false;
        }finally{
            con.end()
        }
    }
    public async GetGalleriesByOwnerEmail(user: User): Promise<[string]|null> {
        let con = await this.getConnection()
        try{
            let [rows] = await con.execute("select * from GALLERY where OWNER_ID = (select ID from USER where USER.EMAIL = ?)",[user.email])
            if(rows){
                let galleryList:[string] = [""]
                for(let i in rows){
                    galleryList.push(rows[i].NAME)
                }
                galleryList.shift()
                return galleryList
            }
        }catch(error){
            this.iloggerservice.error(error);
            return null;
        }finally{
            con.end()
        }
    }

}