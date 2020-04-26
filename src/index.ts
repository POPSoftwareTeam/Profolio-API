import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { UserController } from "./Controllers/UserController";
import {MySqlUserRepository} from "./Repositories/MySqlUserRepository";
import { JWTAuthenticationService } from "./Services/Authentication/JWTAuthenticateService";
import { UserService } from "./Services/Users/UserService";
const result = dotenv.config();

if (result.error) {
  throw result.error;
}
// repositorys
const IUserRepository = new MySqlUserRepository();

// services
const IUserService = new UserService(IUserRepository);
const IAuthenticationService = new JWTAuthenticationService(IUserService);


// controllers
const usercontroller = new UserController(IUserService, IAuthenticationService);

// app setup.
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json({limit: "50mb", type: "application/json"}));
app.use(cors());

app.get("/", (req, res) => usercontroller.GetRoot(req, res));
app.post("/Register", (req, res) => usercontroller.PostRegister(req, res));
app.post("/Login", (req, res) => IAuthenticationService.AuthenticateUser(req, res));
app.post("/DeleteAccount", (req, res) => usercontroller.PostDeleteUser(req, res));
app.listen(80, () =>
  console.log("Example app listening on port 80!"),
);
