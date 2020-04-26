import { IMailerService } from "./IMailerService";
const nodemailer = require("nodemailer");

export class MailerService implements IMailerService{
    public async SendRegistrationEmail(email: string): Promise<boolean> {
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

               let validatehash = "1234";

               const mailOptions = {
                 from: Account, // sender address
                 to: email, // list of receivers
                 subject: 'Welcome To ProFolio.com', // Subject line
                 html: '<h1> Welcome '+email+'. we are very excited to have you as one of our users please verify your account by clicking on the link below</h1> <br> <a href="http://138.197.220.130/uservalidate/'+validatehash+'"> validate your email</a>'
               };


               await transporter.sendMail(mailOptions);

        
            return true;
        }catch(e){
            console.log(e);
            return false
        }
    }

}