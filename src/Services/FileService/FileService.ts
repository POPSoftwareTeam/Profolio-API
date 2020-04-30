import { IFileService } from "./IFileService";

const fs = require('fs')

export class FileService implements IFileService{
    GetImage(photoID: string): any {
        console.log(process.cwd())
        let photo = fs.readFileSync('./Photos/'+photoID)
        return photo
    }

}