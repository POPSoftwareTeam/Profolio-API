export interface IMailerService{
    SendRegistrationEmail(email:string):Promise<boolean>;
}