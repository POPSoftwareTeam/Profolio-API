import { IFileService } from "./IFileService";
const Jimp = require('jimp');
const fs = require('fs');


export class FileService implements IFileService{
    public async CreateImage(photo:any,guid:string):Promise<boolean>{
        const lowressize = parseInt(process.env.LOW_RES_IMAGE_SIZE);
        const lowresquality = parseInt(process.env.LOW_RES_IMAGE_QUALITY);
        try{
            await this.CreateFullResImage(photo,guid);
            await this.CreateLowResImage(guid,lowressize,lowresquality);
            return true
        }catch(error){
            console.log(error)
            return false;
        }
    }

    private async CreateFullResImage(photo: any,guid:string) {
        try{
            await fs.writeFileSync("./photo-storage/fullres/"+guid+".jpg",photo,'binary')
        }catch(error){
            throw error
        }
    }

    private async CreateLowResImage(guid: string,size:number,quality:number) {
        try{
        const image = await Jimp.read('./photo-storage/fullres/'+guid+".jpg");
        await image.resize(size, Jimp.AUTO);
        await image.quality(quality);
        await image.writeAsync('./photo-storage/lowres/'+guid+".jpg");
        }catch(error){
            throw error
        }
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