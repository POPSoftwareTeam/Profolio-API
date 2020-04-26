import { Request, Response } from "express";
import { Post } from "../Models/PostModel";
import { User } from "../Models/UserModel";
import { IAuthenticationService } from "../Services/IAuthenticationService";
import { IPostService } from "../Services/IPostService";
import { IUserService } from "../Services/IUserService";

export class PostController {
    public iauthenticationservice: IAuthenticationService;
    public ipostservice: IPostService;
    constructor(IAuthenticationService: IAuthenticationService, IPostService: IPostService) {
        this.iauthenticationservice = IAuthenticationService;
        this.ipostservice = IPostService;
    }
    public async PostCreatePost(req: Request, res: Response): Promise<void> {
        const user = await this.iauthenticationservice.AuthenticateToken(req, res);
        if (user) {
            const post = new Post(0, user.id,"", req.body.Post.title, req.body.Post.content);
            if (await this.ipostservice.CreatePost(post, user)) {
            res.write(JSON.stringify({Status: "success", Message: "Post created successfully"}));
            res.end();
            return;
            } else {
                res.write(JSON.stringify({Status: "failure", Message: "The post was not created"}));
                res.end();
                return;
            }
        }
    }
    public async GetTopTenPosts(req: Request, res: Response): Promise<void> {
        const user = await this.iauthenticationservice.AuthenticateToken(req, res);
        if (user) {
            let PostList = await this.ipostservice.GetTopTenPosts();
            res.write(JSON.stringify({Status: "success",Data:PostList}));
            res.end();
            return;
        }
    }

}
