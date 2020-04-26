import { Post } from "../Models/PostModel";
import { IPostRepository } from "./IPostRepository";
const mysql2 = require("mysql2/promise");

export class MySqlPostRepository implements IPostRepository {
    private async getConnection() {
        const con = await mysql2.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,

        });
        return con;
    }
    public async CreatePost(post: Post): Promise<boolean> {
        const con = await this.getConnection();
        try {
            const [rows] = await con.execute("INSERT INTO POST (USERID,TITLE,CONTENT) VALUE (?,?,?)", [post.userid, post.title, post.content]);
            return Promise.resolve(true);
        } catch (error) {
            console.log(error);
            return Promise.resolve(false);
        } finally {
            con.end();
        }
    }
    public async GetTopTenPosts(): Promise<Post[]> {
        const con = await this.getConnection();
        try {
            const [rows] = await con.execute("SELECT USER.EMAIL , POST.ID , POST.USERID, POST.TITLE,POST.CONTENT FROM POST INNER JOIN USER on (POST.USERID = USER.ID) LIMIT 10;");
            let postarray: Post[] = []
            for(let i = 0; i < rows.length; i++){
                postarray.push(new Post(rows[i].ID,rows[i].USERID,rows[i].EMAIL,rows[i].TITLE,rows[i].CONTENT));
            }
            return postarray
        } catch (error) {
            console.log(error);
            return null
        } finally {
            con.end();
        }
    }

}
