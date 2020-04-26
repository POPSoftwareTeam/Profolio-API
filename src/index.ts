import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { PostController } from "./Controllers/PostController";
import { UserController } from "./Controllers/UserController";
import { MySqlPostRepository } from "./Repositories/MySqlPostRepository";
import {MySqlUserRepository} from "./Repositories/MySqlUserRepository";
import { JWTAuthenticationService } from "./Services/JWTAuthenticateService";
import { PostService } from "./Services/PostService";
import { UserService } from "./Services/UserService";
const result = dotenv.config();

if (result.error) {
  throw result.error;
}
// repositorys
const IUserRepository = new MySqlUserRepository();
const IPostRepository = new MySqlPostRepository();

// services
const IUserService = new UserService(IUserRepository);
const IAuthenticationService = new JWTAuthenticationService(IUserService);
const IPostService = new PostService(IPostRepository, IUserRepository);

// controllers
const usercontroller = new UserController(IUserService, IAuthenticationService);
const postcontroller = new PostController(IAuthenticationService, IPostService);

// app setup.
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json({limit: "50mb", type: "application/json"}));
app.use(cors());

app.get("/", (req, res) => usercontroller.GetRoot(req, res));
app.post("/Register", (req, res) => usercontroller.PostRegister(req, res));
app.post("/Login", (req, res) => IAuthenticationService.AuthenticateUser(req, res));
app.post("/DeleteAccount", (req, res) => usercontroller.PostDeleteUser(req, res));
app.post("/CreatePost", (req, res) => postcontroller.PostCreatePost(req, res));
app.get("/GetTopTenPosts",(req, res) => postcontroller.GetTopTenPosts(req, res));
app.listen(80, () =>
  console.log("Example app listening on port 80!"),
);
