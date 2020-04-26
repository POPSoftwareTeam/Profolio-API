import { Post } from "../Models/PostModel";
import { User } from "../Models/UserModel";

export interface IPostService {
    CreatePost(post: Post, user: User): Promise<boolean>;
    GetTopTenPosts(): Promise<Post[]|null>;
}
