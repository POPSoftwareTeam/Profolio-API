import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
//controllers
import { UserController } from "./Controllers/UserController";
import {PhotoController} from "./Controllers/PhotoController";
//services
import {ConsoleLoggerService} from "./Services/Logging/ConsoleLoggerService"
import { JWTAuthenticationService } from "./Services/Authentication/JWTAuthenticateService";
import { UserService } from "./Services/Users/UserService";
import {MailerService} from "./Services/Email/MailerService"
import { FileService } from "./Services/FileService/FileService";
import {DummyPhotoService} from "./Services/Photo/DummyPhotoService"

//repositories
import {UserRepository} from "./Repositories/UserRepository";
import { PhotoRepository } from "./Repositories/PhotoRepository";
import { PhotographerController } from "./Controllers/PhotographerController";
import { PhotographerService } from "./Services/Photographer/PhotographerService";

const result = dotenv.config();

if (result.error) {
  throw result.error;
}
//Logging Service
const ILoggerService = new ConsoleLoggerService()

// repositorys
const IUserRepository = new UserRepository(ILoggerService);
const IPhotoRepository = new PhotoRepository(ILoggerService);

// services
const IMailerService = new MailerService()
const IUserService = new UserService(IUserRepository,IMailerService);
const IAuthenticationService = new JWTAuthenticationService(IUserService);
const IFileService = new FileService();
const IPhotoService = new DummyPhotoService(IFileService,IPhotoRepository);
const IPhotographerService = new PhotographerService(ILoggerService,IPhotoRepository,IUserRepository)


// controllers
const userController = new UserController(IUserService, IAuthenticationService);
const photoController = new PhotoController(IAuthenticationService,IPhotoService);
const photographerController = new PhotographerController(ILoggerService,IAuthenticationService,IPhotographerService);

// app setup.
const app = express();
const bodyParser = require("body-parser");
const json = bodyParser.json({limit: "50mb", type: "application/json"});
const urlencoded = bodyParser.urlencoded({ extended: false })
const multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })


app.use(cors());

//Auth Routes
app.get("/", json,(req, res) => userController.GetRoot(req, res));
app.post("/Register/Client", json,(req, res) => userController.PostClientRegister(req, res));
app.post("/Register/Photographer", json,(req, res) => userController.PostPhotographerRegister(req, res));
app.post("/Login", json,(req, res) => userController.PostLogin(req, res));
app.post("/DeleteAccount",json, (req, res) => userController.PostDeleteUser(req, res));
app.get("/Verify/ClientEmail/:guid",(req,res)=>userController.VerifyClientEmail(req,res));
app.get("/Verify/PhotographerEmail/:guid",(req,res)=>userController.VerifyPhotographerEmail(req,res));

//Photo Viewing Routes
app.get("/Photos/FullRes/:PhotoID",json,(req,res)=>photoController.GetFullResPhoto(req,res));
app.get("/Photos/LowRes/:PhotoID",json,(req,res)=>photoController.GetLowResPhoto(req,res));

//Uploading image
app.post("/Photos/Upload",urlencoded, upload.single('avatar'),(req,res)=>photoController.UploadPhoto(req,res))

//Photographer Control Routes
app.get("/Photographer/MyPhotos",json,(req,res)=>photographerController.GetUserPhotos(req,res))
app.post("/Photographer/GrantClientPermissions",json, (req,res)=>photographerController.GrantClientPermission(req,res))


app.listen(80, () =>
  console.log("Example app listening on port 80!"),
);
