export interface IMailerService{
    SendRegistrationEmail(email:string, guid:string):Promise<boolean>;
}