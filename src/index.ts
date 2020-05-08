import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
//controllers
import { UserController } from "./Controllers/UserController";
import {PhotoController} from "./Controllers/PhotoController";
import { GalleryController } from "./Controllers/GalleryController";

//services
import {ConsoleLoggerService} from "./Services/Logging/ConsoleLoggerService"
import { JWTAuthenticationService } from "./Services/Authentication/JWTAuthenticateService";
import { UserService } from "./Services/Users/UserService";
import {MailerService} from "./Services/Email/MailerService"
import { FileService } from "./Services/FileService/FileService";
import {DummyPhotoService} from "./Services/Photo/DummyPhotoService"
import { GalleryService } from "./Services/Gallery/GalleryService";

//repositories
import {UserRepository} from "./Repositories/UserRepository";
import { PhotoRepository } from "./Repositories/PhotoRepository";
import {GalleryRepository} from "./Repositories/GalleryRepository";

const result = dotenv.config();

if (result.error) {
  throw result.error;
}
//Logging Service
const ILoggerService = new ConsoleLoggerService()

// repositorys
const IUserRepository = new UserRepository(ILoggerService);
const IPhotoRepository = new PhotoRepository(ILoggerService);
const IGalleryRepository = new GalleryRepository(ILoggerService)

// services
const IMailerService = new MailerService()
const IUserService = new UserService(IUserRepository,IMailerService);
const IAuthenticationService = new JWTAuthenticationService(IUserService);
const IFileService = new FileService();
const IPhotoService = new DummyPhotoService(ILoggerService,IFileService,IPhotoRepository,IUserRepository);
const IGalleryService = new GalleryService(ILoggerService,IPhotoRepository,IUserRepository,IGalleryRepository);


// controllers
const userController = new UserController(ILoggerService,IUserService, IAuthenticationService);
const photoController = new PhotoController(ILoggerService,IAuthenticationService,IPhotoService);
const galleryController = new GalleryController(ILoggerService,IAuthenticationService,IGalleryService);


// app setup.
const app = express();
const bodyParser = require("body-parser");
const json = bodyParser.json({limit: "50mb", type: "application/json"});
const urlencoded = bodyParser.urlencoded({ extended: false })
const multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })


app.use(cors());

//User Routes
app.get("/", json,(req, res) => userController.GetRoot(req, res));
app.post("/Register/Client", json,(req, res) => userController.PostClientRegister(req, res));
app.post("/Register/Photographer", json,(req, res) => userController.PostPhotographerRegister(req, res));
app.post("/Login", json,(req, res) => userController.PostLogin(req, res));
app.post("/DeleteAccount",json, (req, res) => userController.PostDeleteUser(req, res));
app.get("/Verify/ClientEmail/:guid",(req,res)=>userController.VerifyClientEmail(req,res));
app.get("/Verify/PhotographerEmail/:guid",(req,res)=>userController.VerifyPhotographerEmail(req,res));

//Photos
app.post("/Photos/Upload",urlencoded, upload.single('avatar'),(req,res)=>photoController.UploadPhoto(req,res))
app.post("/Photos/GrantClientPermissions",json, (req,res)=>photoController.GrantClientPermission(req,res))
app.get("/Photos/FullRes/:PhotoID",json,(req,res)=>photoController.GetFullResPhoto(req,res));
app.get("/Photos/LowRes/:PhotoID",json,(req,res)=>photoController.GetLowResPhoto(req,res));
app.get("/Photos/Delete/:PhotoID",json,(req,res)=>photoController.DeletePhoto(req,res))
app.get("/Photos/MyPhotos",json,(req,res)=>photoController.GetUserPhotos(req,res))
app.get("/photos/SharedWithMe",json,(req,res)=>photoController.GetAllSharedClientPhotos(req,res))

//GalleryController
app.post("/Gallery/Create",json,(req,res)=>galleryController.CreateGallery(req,res))




app.listen(80, () =>
  console.log("Example app listening on port 80!"),
);
