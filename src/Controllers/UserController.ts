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
    public async PostRegister(req: Request, res: Response): Promise<void> {
        const user = new User(null, req.body.User.email, req.body.User.password, req.body.User.authorization);
        if (await this.iuserservice.CreateUser(user)) {
            res.write(JSON.stringify({Status: "success", Message: "The user was successfuly added to the database"}));
            res.end();
            return;
        } else {
            res.write(JSON.stringify({Status: "faliure", Message: "Failed to add the user to the database"}));
            res.end();
            return;
        }
    }
    public async PostLogin(req: Request, res: Response): Promise<void> {
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
                res.write(JSON.stringify({Status: "faliure", Message: "The user does not exsist or the password is incorrect"}));
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

}
