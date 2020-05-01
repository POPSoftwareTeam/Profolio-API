import { Request, Response } from "express";
import { User } from "../Models/UserModel";
import { IAuthenticationService } from "../Services/Authentication/IAuthenticationService";
import { IUserService } from "../Services/Users/IUserService";

export class UserController {
    private iuserservice: IUserService;
    private iauthenticationservice: IAuthenticationService;
    constructor( iuserservice: IUserService, iauthenticationservice: IAuthenticationService) {
        this.iuserservice = iuserservice;
        this.iauthenticationservice = iauthenticationservice;
    }
    public async PostClientRegister(req: Request, res: Response): Promise<void> {
        const user = new User(null, req.body.User.email, req.body.User.password, "unverified");
        if (await this.iuserservice.CreateUser(user,"client")) {
            res.write(JSON.stringify({Status: "success", Message: "The client was successfuly added to the database"}));
            res.end();
            return;
        } else {
            res.write(JSON.stringify({Status: "failure", Message: "Failed to add the client to the database"}));
            res.end();
            return;
        }
    }
    public async PostPhotographerRegister(req: Request, res: Response): Promise<void> {
        const user = new User(null, req.body.User.email, req.body.User.password, "unverified");
        if (await this.iuserservice.CreateUser(user,"photographer")) {
            res.write(JSON.stringify({Status: "success", Message: "The photographer was successfuly added to the database"}));
            res.end();
            return;
        } else {
            res.write(JSON.stringify({Status: "failure", Message: "Failed to add the photographer to the database"}));
            res.end();
            return;
        }
    }
    public async PostLogin(req: Request, res: Response): Promise<void> {
        console.log("In Login");
        await this.iauthenticationservice.AuthenticateUser(req, res);
    }
    public async PostDeleteUser(req: Request, res: Response): Promise<void>  {
        const usertobedeleted = new User(null, req.body.User.email, "", req.body.User.authorization);
        const user: User = await this.iauthenticationservice.AuthenticateToken(req, res);
        if (user.email == usertobedeleted.email) {
            if (await this.iuserservice.RemoveUser(usertobedeleted)) {
                res.write(JSON.stringify({Status: "success", Message: "the user was successfully removed."}));
                res.end();
                return;
            } else {
                res.write(JSON.stringify({Status: "failure", Message: "The user does not exsist or the password is incorrect"}));
                res.end();
                return;
            }
        }

    }

    public async GetRoot(req: Request, res: Response): Promise<void> {
        const user = await this.iauthenticationservice.AuthorizeToken(req, res, "user");
        if (user) {
            const response: string = JSON.stringify({Status: "success", Message: "You are authorized"});
            res.write(response);
            res.end();
        }

    }

    public async VerifyClientEmail(req:Request,res:Response): Promise<void>{
        const guid = req.params.guid;
        if (await this.iuserservice.VerifyClientEmail(guid)) {
            res.write(JSON.stringify({Status: "success", Message: "The client email was verified"}));
            res.end();
            return;
        } else {
            res.write(JSON.stringify({Status: "failure", Message: "The client email was not verified"}));
            res.end();
            return;
        }
    }

    public async VerifyPhotographerEmail(req:Request,res:Response): Promise<void>{
        const guid = req.params.guid;
        if (await this.iuserservice.VerifyPhotographerEmail(guid)) {
            res.write(JSON.stringify({Status: "success", Message: "The photographer email was verified"}));
            res.end();
            return;
        } else {
            res.write(JSON.stringify({Status: "failure", Message: "The photographer email was not verified"}));
            res.end();
            return;
        }
    }

}
