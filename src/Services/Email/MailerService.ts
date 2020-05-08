import { IMailerService } from "./IMailerService";
const nodemailer = require("nodemailer");

export class MailerService implements IMailerService{
    public async SendRegistrationEmail(email: string, guid:string): Promise<boolean> {
        try{

            let Account = process.env.EMAIL;
            let Password = process.env.EMAIL_PASSWORD

            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                secure: true, 
                auth: {
                       user: Account,
                       pass: Password
                   }
               });


               const mailOptions = {
                 from: Account, // sender address
                 to: email, // list of receivers
                 subject: 'Welcome To ProFolio.com', // Subject line
                 html: "<h1> Welcome "+email+". we are very excited to"+ 
                        "have you as one of our users please verify your "+
                        "account by clicking on the link below</h1>"+ 
                        "<br> <a href="+process.env.DOMAIN_NAME+"/verify/"+guid+">click here to verify your email</a>"
               };


               await transporter.sendMail(mailOptions);

        
            return true;
        }catch(e){
            return false
        }
    }

}