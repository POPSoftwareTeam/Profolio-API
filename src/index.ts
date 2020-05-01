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
import {UserRepository} from "./Repositories/UserRepository";
import { PhotoRepository } from "./Repositories/PhotoRepository";

const result = dotenv.config();

if (result.error) {
  throw result.error;
}
// repositorys
const IUserRepository = new UserRepository();
const IPhotoRepository = new PhotoRepository();

// services
const IMailerService = new MailerService()
const IUserService = new UserService(IUserRepository,IMailerService);
const IAuthenticationService = new JWTAuthenticationService(IUserService);
const IFileService = new FileService();
const IPhotoService = new DummyPhotoService(IFileService,IPhotoRepository);


// controllers
const userController = new UserController(IUserService, IAuthenticationService);
const photoController = new PhotoController(IAuthenticationService,IPhotoService);

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
app.get("/Photos/MyPhotos",json,(req,res)=>photoController.GetUserPhotos(req,res))

var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
//Uploading image
app.post("/Photos/Upload",urlencoded, upload.single('avatar'),(req,res)=>photoController.UploadPhoto(req,res))


app.listen(80, () =>
  console.log("Example app listening on port 80!"),
);
