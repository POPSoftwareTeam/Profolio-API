export interface IFileService{
    GetFullResImage(photoID:string):any
    GetLowResImage(photoID:string):any
    CreateLowResImage(guid:string):any
    CreateFullResImage(photoID:any,guid:string):any
    CreateImage(photo:any,guid:string):any
}