import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
//controllers
import { UserController } from "./Controllers/UserController";
import {PhotoController} from "./Controllers/PhotoController";
//services
import { JWTAuthenticationService } from "./Services/Authentication/JWTAuthenticateService";
import { UserService } from "./Services/Users/UserService";
import {MailerService} from "./Services/Email/MailerService"
import { FileService } from "./Services/FileService/FileService";
import {DummyPhotoService} from "./Services/PhotoService/DummyPhotoService"

//repositories
import {MySqlUserRepository} from "./Repositories/MySqlUserRepository";

const result = dotenv.config();

if (result.error) {
  throw result.error;
}
// repositorys
const IUserRepository = new MySqlUserRepository();

// services
const IMailerService = new MailerService()
const IUserService = new UserService(IUserRepository,IMailerService);
const IAuthenticationService = new JWTAuthenticationService(IUserService);
const IFileService = new FileService();
const IPhotoService = new DummyPhotoService(IFileService);


// controllers
const userController = new UserController(IUserService, IAuthenticationService);
const photoController = new PhotoController(IAuthenticationService,IPhotoService);

// app setup.
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json({limit: "50mb", type: "application/json"}));
app.use(cors());

//Auth Routes
app.get("/", (req, res) => userController.GetRoot(req, res));
app.post("/Register/Client", (req, res) => userController.PostClientRegister(req, res));
app.post("/Register/Photographer", (req, res) => userController.PostPhotographerRegister(req, res));
app.post("/Login", (req, res) => IAuthenticationService.AuthenticateUser(req, res));
app.post("/DeleteAccount", (req, res) => userController.PostDeleteUser(req, res));
app.get("/Verify/ClientEmail/:guid",(req,res)=>userController.VerifyClientEmail(req,res));
app.get("/Verify/PhotographerEmail/:guid",(req,res)=>userController.VerifyPhotographerEmail(req,res));

//Photo Viewing Routes
app.get("/Photos/FullRes/:PhotoID",(req,res)=>photoController.GetFullPhoto(req,res));

app.listen(80, () =>
  console.log("Example app listening on port 80!"),
);
