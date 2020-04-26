import { Request, Response } from "express";
import { User } from "../Models/UserModel";
import { IAuthenticationService } from "../Services/Authentication/IAuthenticationService";
import { IUserService } from "../Services/Users/IUserService";

export class AdminController {
    private iuserservice: IUserService;
    private iauthenticationservice: IAuthenticationService;
    constructor( iuserservice: IUserService, iauthenticationservice: IAuthenticationService) {
        this.iuserservice = iuserservice;
        this.iauthenticationservice = iauthenticationservice;
    }

    public async GetAdminHomePage(req: Request, res: Response): Promise<void> {
        const user = await this.iauthenticationservice.AuthorizeToken(req, res, "admin");
        if (user) {
            const response: string = JSON.stringify({Message: "You are authorized"});
            res.write(response);
            res.end();
        }
    }

    public async PostAdminDeleteUser(req: Request, res: Response): Promise<void> {
        const user = await this.iauthenticationservice.AuthorizeToken(req, res, "admin");
        const usertobedeleted = new User(null, req.body.User.Email, req.body.User.Password, req.body.User.Authorization);
        if (user) {
            if (await this.iuserservice.RemoveUser(usertobedeleted)) {
                res.write(JSON.stringify({Status: "success", Message: "the user was successfully removed."}));
                res.end();
                return;
            } else {
                res.write(JSON.stringify({Status: "faliure", Message: "The user does not exsist or the password is incorrect"}));
                res.end();
                return;
            }
        } else {
            res.write(JSON.stringify({Status: "faliure", Message: "Not Authorized"}));
            res.end();
            return;
        }
    }
}
