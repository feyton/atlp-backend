//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import * as views from "./views.js";

const router = Router();

//write your routes here

router.get("/", views.IndexView);

//Keep this line at the bottom

export { router };
