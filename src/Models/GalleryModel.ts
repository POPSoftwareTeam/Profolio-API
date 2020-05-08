export class Gallery{
    readonly id:number
    readonly name:string;
    readonly description:string;
    public photos:[string];
    constructor(id:number,name:string,description:string){
        this.id = id;
        this.name = name;
        this.description = description;
    }
    public AddPhoto(photo:string){
        if(this.photos){
            this.photos.push(photo)
        }
        else{
            this.photos = [photo]
        }
    }
}