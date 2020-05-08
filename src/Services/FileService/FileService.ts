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
            return false;
        }
    }

    private async CreateFullResImage(photo: any,guid:string) {
        await fs.writeFileSync("./photo-storage/fullres/"+guid+".jpg",photo,'binary')
    }

    private async CreateLowResImage(guid: string) {
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
        let photo = fs.readFileSync('./photo-storage/lowres/'+photoID)
        return photo
    }

    public DeleteImage(photoID: string): boolean {
        try{
            fs.unlinkSync('./photo-storage/lowres/'+photoID)
            fs.unlinkSync('./photo-storage/fullres/'+photoID)
            return true
        }catch(error){
            return false
        }
    }

}