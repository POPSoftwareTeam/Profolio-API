import { Post } from "../Models/PostModel";

export interface IPostRepository {
    CreatePost(post: Post): Promise<boolean>;
    GetTopTenPosts(): Promise<Post[]>;
}
