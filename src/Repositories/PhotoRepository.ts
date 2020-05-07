import { IPhotoRepository } from "./IPhotoRepository";
import {User} from "../Models/UserModel"
import { ILoggerService } from "../Services/Logging/ILoggerService";
const mysql2 = require("mysql2/promise");

export class PhotoRepository implements IPhotoRepository{
    readonly iloggerservice:ILoggerService
    constructor(iloggerservice:ILoggerService){
        this.iloggerservice = iloggerservice
    }
    async getConnection() {
        const con = await mysql2.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            
        });
        return con;
    }
    public async CreatePhoto(title:string,guid: string, user: User): Promise<boolean> {
        let con = await this.getConnection();
        try {
            const [rows] = await con.execute("SELECT * from USER where EMAIL = ?", [user.email]);
            if (typeof rows[0] != "undefined") {
                const DBuser = new User(rows[0].ID, rows[0].EMAIL, rows[0].PASSWORD, rows[0].ROLE);
                let [rows2] = await con.execute("INSERT INTO PHOTO (OWNER_ID,FILENAME,TITLE) VALUES (?,?,?)", [DBuser.id,guid,title]);
                
            } else {
                throw new Error("user is undefined")
            }
        } catch (error) {
            this.iloggerservice.error(error);
            return Promise.resolve(false);
        } finally {
            con.end();
        }
    }    
    public async GetPhotosByUser(user: User): Promise<[string]> {
        let con = await this.getConnection();
        try {
            const [rows] = await con.execute("SELECT PHOTO.FILENAME from USER inner join PHOTO on (PHOTO.OWNER_ID = USER.ID) where USER.EMAIL = ?", [user.email]);
            if (typeof rows[0] != "undefined") {
                let photoarray =  this.generateFileNameList(rows);
                return photoarray;
            } else {
                throw new Error("user is undefined")
            }
        } catch (error) {
            this.iloggerservice.error(error);
            return Promise.resolve([""]);
        } finally {
            con.end();
        }
    }
    public async GetOwnerEmailByPhoto(guid: string): Promise<string> {
        let con = await this.getConnection();
        try {
            const [rows] = await con.execute("SELECT USER.EMAIL from USER inner join PHOTO on (PHOTO.OWNER_ID = USER.ID) WHERE PHOTO.FILENAME=?", [guid]);
            if(rows[0]["EMAIL"]){
                return rows[0]["EMAIL"]
            }else{
                throw("user does not exist")
            }
        }catch(error){
            this.iloggerservice.error(error);
            return "";
        }finally {
            con.end();
        }
    }
    public async GetPhotoIDByFILENAME(guid:string):Promise<string>{
        let con = await this.getConnection();
        try {
            const [rows] = await con.execute("SELECT ID from PHOTO where FILENAME = ?", [guid]);
            if (typeof rows[0] != "undefined") {
                return rows[0].ID
            } else {
                throw new Error("user is undefined")
            }
        } catch (error) {
            this.iloggerservice.error(error);
            throw new Error("Photo not found")
        } finally {
            con.end();
        }
    }

    public async AddViewingPermissions(clientID:number,guid:string,permission:string):Promise<Boolean>{
        let con = await this.getConnection();
        try {
            let photoID = await this.GetPhotoIDByFILENAME(guid);
            const [rows] = await con.execute("INSERT into USER_PHOTO (USER_ID,PHOTO_ID,PERMISSION) VALUES (?,?,?)", [clientID,photoID,permission]);
            return true
        }catch(error){
            this.iloggerservice.error(error);
            return false;
        }finally {
            con.end();
        }
    }
    public async GetAllPhotosSharedWithClient(email: string): Promise<[string]> {
        let con = await this.getConnection()
        try{
            const [rows] = await con.execute("Select PHOTO.FILENAME from USER inner join USER_PHOTO on (USER.ID = USER_PHOTO.USER_ID) inner join PHOTO on (USER_PHOTO.PHOTO_ID = PHOTO.ID) where USER.EMAIL = ?",[email]);
            if (typeof rows[0] != "undefined") {
                let photoarray =  this.generateFileNameList(rows);
                return photoarray;

            } else {
                throw new Error("No matching items")
            }
        }catch(error){
            this.iloggerservice.error(error)
            throw(error);
        }finally{
            con.end()
        }
    }
    public async IsPhotoSharedWithClient(guid: string, email: string): Promise<"Low_Res"|"Full_Res"|"No_Access"> {
        let con = await this.getConnection()
        try{
            const [rows] = await con.execute("Select USER_PHOTO.PERMISSION from USER inner join USER_PHOTO on (USER.ID = USER_PHOTO.USER_ID) inner join PHOTO on (USER_PHOTO.PHOTO_ID = PHOTO.ID) where USER.EMAIL = ? AND PHOTO.FILENAME=?",[email,guid]);
            if (typeof rows[0] != "undefined") {
                //let photoarray =  this.generateFileNameList(rows);
                return(rows[0].PERMISSION)

            } else {
                throw new Error("No matching items")
            }
        }catch(error){
            this.iloggerservice.error(error)
            return("No_Access")
        }finally{
            con.end()
        }
    }
    private generateFileNameList(rows:any){
        let photoarray:[string]=[""];
        for(let i = 0;i<rows.length;i++){
            photoarray.push(String(rows[i].FILENAME)+".jpg")
        }
        photoarray.shift()
        return photoarray
    }
}