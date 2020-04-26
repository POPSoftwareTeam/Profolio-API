export class Post {
    public readonly id: number|null;
    public readonly userid: number;
    public readonly title: string;
    public readonly content: string;
    public readonly useremail: string;
    constructor(id: number|null, userid: number,useremail: string, title: string, content: string) {
        this.id = id;
        this.userid = userid;
        this.useremail = useremail
        this.title = title;
        this.content = content;
    }
}
