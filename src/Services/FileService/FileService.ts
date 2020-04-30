import { IFileService } from "./IFileService";
const Jimp = require('jimp');
const fs = require('fs');


export class FileService implements IFileService{

    public async CreateImage(photo:any,guid:string):Promise<boolean>{
        try{
            await this.CreateFullResImage(photo,guid);
            await this.CreateLowResImage(guid);
            return true
        }catch(e){
            console.log(e)
            return false;
        }
    }

    async CreateFullResImage(photo: any,guid:string) {
        console.log(photo)
        await fs.writeFileSync(photo,"./"+guid+".jpg",'binary')

        // await fs.writeFileSync(photo,"./photo-storage/fullres/"+guid+".jpg",'binary')
    }

    async CreateLowResImage(guid: string) {
        const image = await Jimp.read('./photo-storage/fullres/'+guid+".jpg");
        await image.resize(800, Jimp.AUTO);
        await image.quality(90);
        await image.writeAsync('./photo-storage/lowres/'+guid+".jpg");
    }

    public GetFullResImage(photoID: string): any {
        let photo = fs.readFileSync('./photo-storage/fullres/'+photoID)
        return photo
    }
    
    public GetLowResImage(photoID: string) {
        console.log(process.cwd())
        let photo = fs.readFileSync('./photo-storage/lowres/'+photoID)
        return photo
    }

}