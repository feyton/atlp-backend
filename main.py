import os

appName = input("Specify app name: ")
BASE = os.path.dirname(os.path.abspath(__file__))

appName = appName + "App"

appDir = os.path.join(BASE, 'src', appName)

modelText = """//The models file is used to define the models that will be used to 
// link on database

import mongoose from "mongoose";
const { Schema, model } = mongoose;

//define your models here



//export your modules here
export {}

"""
routeTxt = """//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import * as views from "./views.js";

const router = Router()

//write your routes here


//Keep this line at the bottom

export { router };
"""
viewsTxt = """//This is where all business logic is handled
//Equivalent to middleware. Create functions that process request here
//Remember to import all in routes
import * as models from "./models.js";


//add your function to export
export {}
"""
utilsText = """//Hanle all other utility functions here and import them into other files
const %sUtil = ()=>{

}


export {%sUtil}

""" % (appName, appName)
if not os.path.exists(appDir):
    os.makedirs(appDir)

    os.chdir(appDir)
    with open("models.js", "w") as models:
        models.write(modelText)
    with open("routes.js", "w") as routes:
        routes.write(routeTxt)
    with open("views.js", "w") as views:
        views.write(viewsTxt)
    with open("utils.js", "w") as utils:
        utils.write(utilsText)

    print("New App create: ", appName)
else:
    print("the app already exists")
