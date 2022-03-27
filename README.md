![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2Ffeytonf) [![GitHub forks](https://img.shields.io/github/forks/feyton/atlp-backend?style=social)](https://github.com/feyton/atlp-backend/network) [![Maintainability](https://api.codeclimate.com/v1/badges/a17c4a38e6fb7e73a3f1/maintainability)](https://codeclimate.com/github/feyton/atlp-backend/maintainability) [![GitHub stars](https://img.shields.io/github/stars/feyton/atlp-backend)](https://github.com/feyton/atlp-backend/stargazers) [![GitHub issues](https://img.shields.io/github/issues/feyton/atlp-backend)](https://github.com/feyton/atlp-backend/issues) [![Coverage Status](https://coveralls.io/repos/github/feyton/atlp-backend/badge.svg?branch=main)](https://coveralls.io/github/feyton/atlp-backend?branch=main) [![CI](https://github.com/feyton/atlp-backend/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/feyton/atlp-backend/actions/workflows/main.yml)
# atlp-backend my brand
The backend code for the ATLP Project.

## General description
This is a backend project for the capstone project.
It is written in ES6 and run on Node v16. The idea is to create a backend for a personal website that have a blog part. We are still learning.

## Technology Stack
1. Node.js
2. Express
3. Mocha (Testing)
4. Mongodb (Database)
5. Postmana (Local dev)
6. Swagger (Documentation)
## Responses:
Expect the following response structures:
```
code        Response structure
- 2xx         {status: success, code: 2xx, data: {objectKey: Value}}
- 400         {status: fail, code: 4xx, data}
- 401         {status: fail, code: 4xx, message: string}
- 403         {status: fail, code: 4xx, message: string}
- 406         {status: fail, code: 4xx, data: {key:value}}
- 409         {status: fail, code: 4xx, data: {key:value}}
- 4xx        {status: fail, code: 4xx, message: string}
- 5xx         {status: error, code: 5xx, message: string}
```
## Servers

The API is hosted on Heroku on different pipelines.
As this is an API, you will be redirected to DOCS pages and test the features there


To test our stable version use the:
- Production Link : ["https://atlp-backend.herokuapp.com/"]
- Production branch : [main](https://github.com/feyton/atlp-backend/tree/main)
- Production appname : **atlp-backend**

Wanna up the game? Check our staging pipeline here.
- Staging Pipeline: ["https://atlp-backend-staging.herokuapp.com/"]
- Staging branch: [staging](https://github.com/feyton/atlp-backend/tree/staging)

## How to contribute
Give us your review and comments? Check the features in development and give your 
comments on the active pull requests on GitHub
- Development Pipeline: "Depend on the branch that has a pull request"
- Development branch: [Staging Branch](https://github.com/feyton/atlp-backend/tree/staging)

Or you can just develop locally and sent a PR

```
git clone https://github.com/feyton/atlp-backend
cd atlp-backend
npm install
touch .env // check your os if you have an error. Or create with editor at the project root dir
npm run dev
// add the lines below in your .env file

```

#### Environment setup
These configurations should be in your `.env` file
**Required**
</hr>

```
ACCESS_TOKEN_SECRET=< your custom key >
REFRESH_TOKEN_SECRET=< your custom key >
MONGO_DB_URL = < your custom dev database >
TESTING_DB_URL=< your custom testing database >
API_BASE= /api/v1
NODE_ENV="dev"
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=700000

// Swagger JS configuration
SERVER_URL=http://127.0.0.1:3500
SERVER_NAME="LOCAL HOST"

// if you want to upload picture. Or replace with local storage
CLOUDINARY_URL=< cloudinary configuration url>
cloud_name=< cloudinary name >
api_key =< cloudinary api key >
api_secret=< cloudinary secrets >

EMAIL_HOST=< your email host >
EMAIL_USER=< your email user >
EMAIL_PASSWORD=< your email password >
BASE_URL="http://localhost:3500/api/v1/accounts"
EMAIL_PORT=< email port >

```

## Acknowledgement
I want to thank everyone who contributed a lot especially:
- My TTL [@Jkadhuwa](https://github.com/Jkadhuwa/jkadhuwa)

## Acknowledgement
I want to thank everyone who contributed a lot especially @Jkadhuwa
### Tools Used
- NodeJS- Web Server
- ExpressJs - Server framework
- ESLint - JavaScript code and syntax linter
- Mocha - Javascript test framework
- Chai - Javascript Assertion library
- c8 - Test coverage tool
- Postman - for tetsing API endpoints
- Heroku - for Hosting
- GitPages - for Frontend deployment
### Integrations
1. PivotalTracker
2. Codeclimate
3. Coveralls
4. Github Actions


