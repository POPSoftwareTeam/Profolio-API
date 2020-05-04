import { User } from "../Models/UserModel";
import { IUserRepository } from "./IUserRepository";
import { ILoggerService } from "../Services/Logging/ILoggerService";
const mysql2 = require("mysql2/promise");

export class UserRepository implements IUserRepository {
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
    public async AddNewUser(user: User,guid:string): Promise<any> {
        if (user.email != "" && user.password != "") {
            const con = await this.getConnection();
            try {
                const [rows] = await con.execute("INSERT INTO USER (EMAIL,PASSWORD,ROLE,EMAILCODE) VALUE (?,?,?,?)", [user.email, user.password, user.authorization,guid]);
                return Promise.resolve(true);
            } catch (error) {
                return Promise.resolve(false);
            } finally {
                con.end();
            }
        }
    }
    public async GetExistingUser(user: User): Promise<User> {
        const con = await this.getConnection();
        try{
            const [rows] = await con.execute("SELECT * from USER where EMAIL = ?", [user.email]);
            if (typeof rows[0] != "undefined") {
                const DBuser = new User(rows[0].ID, rows[0].EMAIL, rows[0].PASSWORD, rows[0].ROLE);
                return Promise.resolve(DBuser);
            } else {
                throw new Error("user is undefined")
            }
        }catch(error){
            this.iloggerservice.error(error);
            const DBuser = new User(null, "void", "void", "unverified");
            return Promise.resolve(DBuser);
        }finally{
            con.end();
        }
    }
    public async RemoveUser(user: User): Promise<any> {
        const con = await this.getConnection();
        try {
            const [rows] = await con.execute("Delete from USER where EMAIL = ?", [user.email]);
            return Promise.resolve(true);
        } catch (error) {
            this.iloggerservice.error(error);
            return Promise.resolve(false);
        } finally {
            con.end();
        }
    }
    public async VerifyEmail(guid: string,level: string): Promise<boolean> {
        const con = await this.getConnection();
        try {
            const [rows] = await con.execute("Select ID from USER where EMAILCODE = ?", [guid]);
            const userID = rows[0].ID;
            const [rows2] = await con.execute("UPDATE USER set EMAILCODE = ?,ROLE=? WHERE ID = ?",["NULL",level,userID])
            return Promise.resolve(true);
        } catch (error) {
            this.iloggerservice.error(error);
            return Promise.resolve(false);
        } finally {
            con.end();
        }
    }
}
