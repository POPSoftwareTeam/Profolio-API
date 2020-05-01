import { IPhotoRepository } from "./IPhotoRepository";
import {User} from "../Models/UserModel"
const mysql2 = require("mysql2/promise");

export class PhotoRepository implements IPhotoRepository{
    async getConnection() {
        const con = await mysql2.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            
        });
        return con;
    }
    public async CreatePhoto(guid: string, user: User): Promise<boolean> {
        let con = await this.getConnection();
        try {
            const [rows] = await con.execute("SELECT * from USER where EMAIL = ?", [user.email]);
            if (typeof rows[0] != "undefined") {
                const DBuser = new User(rows[0].ID, rows[0].EMAIL, rows[0].PASSWORD, rows[0].ROLE);
                let [rows2] = await con.execute("INSERT INTO PHOTOS ", [user.email]);

            } else {
                throw new Error("user is undefined")
            }
        } catch (error) {
            return Promise.resolve(false);
        } finally {
            con.end();
        }
    }

}