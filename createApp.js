/**
 * Use this script for development purpose only
 *
 * I included this in the repository to share few techniques
 * used to work with a file system.
 *
 * This has been useful when I was working with cPanel hosting.
 * Which does not provide a straight forward way to makes files accessible to the public through the
 * project repository
 *
 * I love emojis=>> Install with npm i node-emoji -D if you want to try
 *
 *  */

import { existsSync, promises as fsPromises } from "fs";
import nodeEmoji from "node-emoji";
import path, { join } from "path";
import { createInterface } from "readline";
const __dirname = path.resolve();

const airplane = nodeEmoji.get("airplane");

const rlPrompt = `\n${nodeEmoji.get("large_green_circle")}${nodeEmoji.get(
  "large_green_circle"
)}  Welcome to createApp interface ${nodeEmoji.get(
  "v"
)}. Starting ${airplane}\n`;

// Text to be written to the files
const modelText = `//The models file is used to define the models that will be used to 
// link on database

import mongoose from "mongoose";
const { Schema, model } = mongoose;

//define your models here



//export your modules here
export {}

`;

const routeTxt = `//Use this file to specify the routes for the app
//remember to include this routes in the index
import { Router } from "express";
import * as views from "./views.js";
import * as middleware from "./middleware.js";

const router = Router()

//write your routes here


//Keep this line at the bottom

export { router };
`;
const viewsTxt = `//This is where all business logic is handled
//Equivalent to middleware. Create functions that process request here
//Remember to import all in routes
import * as models from "./models.js";


//add your function to export
export {}
`;
const validatorTxt = `//This is where all requests checks are handled like validation
import {body, check, validationResult} from "express-validator";
//import * as models from "./models.js"; //import if needed

export const routeValidationRules = ()=>{
  return [
    // Array of validations. Call the function when added to the route
  ]
}



//add your function to export

`;
const utilsText = `//Hanle all other utility functions here and import them into other files


export {}
`;

const middlewareTxt = `//Add prerequest check here to be used in routes



export {}
`;
// A welcome message

console.log(rlPrompt);
// Where business happens
const createFiles = async (dir) => {
  await fsPromises.appendFile(join(dir, "routes.js"), routeTxt, (err) => {
    throw err;
  });
  await fsPromises.appendFile(join(dir, "models.js"), modelText, (err) => {
    throw err;
  });
  await fsPromises.appendFile(
    join(dir, "validator.js"),
    validatorTxt,
    (err) => {
      throw err;
    }
  );
  await fsPromises.appendFile(
    join(dir, "middleware.js"),
    middlewareTxt,
    (err) => {
      throw err;
    }
  );
  await fsPromises.appendFile(join(dir, "utils.js"), utilsText, (err) => {
    throw err;
  });
  await fsPromises.appendFile(join(dir, "views.js"), viewsTxt, (err) => {
    throw err;
  });

  console.log(join(dir, "middleware.js"));
};

//checking if we are not overwriting files

const checkDir = async (dir) => {
  try {
    if (!existsSync(dir)) {
      //create directories
      console.log(
        `${nodeEmoji.get("arrow_right")}${nodeEmoji.get(
          "arrow_right"
        )}\tCreating directories\n\n`
      );
      await fsPromises.mkdir(dir, { recursive: true }); //enable recursive to create subdirectories when they are there
      await createFiles(dir);
      console.log(
        `${nodeEmoji.get(
          "arrow_right"
        )}\tYour new app has been created successfully. ${nodeEmoji.get(
          "heavy_check_mark"
        )}\n`
      );
    } else {
      console.log(
        `\n${nodeEmoji.get("x")}\tThe app already exits!${nodeEmoji.get("x")}\n`
      );
    }
  } catch (error) {
    console.log(error);
  }
};
let appName;

var questions = [
  `${nodeEmoji.get(
    "arrow_right"
  )}\tWhat to name the app we are creating ${nodeEmoji.get(
    "thinking_face"
  )} today?\n \t`,
  `${nodeEmoji.get("arrow_right")}\tWhat is the name ${nodeEmoji.get(
    "telephone"
  )}  of your app?\n\t`,
  `${nodeEmoji.get("arrow_right")}\tRead? ${nodeEmoji.get(
    "iphone"
  )} Give it a name..\n\t`,
  `${nodeEmoji.get("arrow_right")}\tGet ready to be amazed ${nodeEmoji.get(
    "smile"
  )}. Name your app first:${nodeEmoji.get("arrow_down")}\n\t`,
];
var closingMessage = [
  `${nodeEmoji.get("arrow_right")}\tHappy coding today${nodeEmoji.get(
    "man-biking"
  )}\n`,
  `${nodeEmoji.get("arrow_right")}\tHappy hacking today...${nodeEmoji.get(
    "snowflake"
  )}\n`,
  `${nodeEmoji.get("arrow_right")}\tIt was so good to get it ${nodeEmoji.get(
    "airplane_arriving"
  )} started${nodeEmoji.get("airplane")}\n`,
  `${nodeEmoji.get("arrow_right")}\tLet's get it done${nodeEmoji.get(
    "stars"
  )}\n`,
];
const getAppName = createInterface({
  input: process.stdin,
  output: process.stdout,
});
getAppName.question(
  questions[Math.floor(Math.random() * questions.length)],
  async (inputName) => {
    if (!inputName || inputName.length < 1 || inputName == undefined) {
      console.log(
        `\n${nodeEmoji.get("x")}\tA name is required ${nodeEmoji.get(
          "disappointed"
        )} to create an app!${nodeEmoji.get("angry")}\n`
      );
      process.exit(1);
    }
    appName = inputName;
    if (appName == "undefined") {
      console.log(
        `\n${nodeEmoji.get("x")}\tA name is required ${nodeEmoji.get(
          "disappointed"
        )} to create an app! Don't just hit enter..${nodeEmoji.get("angry")}`
      );
      process.exit(1);
    }
    console.log(
      `\n${nodeEmoji.get(
        "fast_forward"
      )}\tWe are creating your app${nodeEmoji.get(
        "airplane"
      )} -${appName}! ${nodeEmoji.get("arrow_double_down")}`
    );
    getAppName.close();
  }
);

getAppName.on("close", async () => {
  const appDir = join(__dirname, "src", `${appName}App`); //get current directory, replace the "src" with your root
  await checkDir(appDir);
  console.log(
    closingMessage[Math.floor(Math.random() * closingMessage.length)] //random texts are my favorite
  );
  process.exit(0);
});

getAppName.on("SIGINT", () => {
  //check if the user exit by hitting CTRL + C or CTRL + D and give them a goodbye
  console.log(
    `\n${nodeEmoji.get("x")}\tSorry to see you go so sudden ${nodeEmoji.get(
      "disappointed"
    )} ${nodeEmoji.get("v")}`
  );
  process.exit(1);
});
