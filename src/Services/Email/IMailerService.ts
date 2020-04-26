export interface IMailerService{
    SendClientRegistrationEmail(email:string, guid:string):Promise<boolean>;
    SendPhotographerRegistrationEmail(email:string, guid:string):Promise<boolean>;
}