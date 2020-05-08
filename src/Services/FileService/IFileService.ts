export interface IFileService{
    GetFullResImage(photoID:string):any
    GetLowResImage(photoID:string):any
    CreateImage(photo:any,guid:string):any
    DeleteImage(guid:string):boolean
}