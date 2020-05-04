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
                let photoarray:[string] = [""]
                for(let i = 0;i<rows.length;i++){
                    photoarray.push(String(rows[i].FILENAME)+".jpg")
                }
                return photoarray
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
}