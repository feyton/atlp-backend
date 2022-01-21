![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2Ffeytonf) [![GitHub forks](https://img.shields.io/github/forks/feyton/atlp-backend?style=social)](https://github.com/feyton/atlp-backend/network) [![Maintainability](https://api.codeclimate.com/v1/badges/a17c4a38e6fb7e73a3f1/maintainability)](https://codeclimate.com/github/feyton/atlp-backend/maintainability) [![GitHub stars](https://img.shields.io/github/stars/feyton/atlp-backend)](https://github.com/feyton/atlp-backend/stargazers) [![GitHub issues](https://img.shields.io/github/issues/feyton/atlp-backend)](https://github.com/feyton/atlp-backend/issues)
# atlp-backend my brand
The backend code for the ATLP Project.

## General description
This is a backend project for the capstone project.
It is written in ES6 and run on Node v16. The idea is to create a backend for a personal website that have a blog part. We are still learning.

## Responses:
Expect the following response structures:
code        Response structure
- 2xx         {status: success, code: 2xx, data: {objectKey: Value}}
- 400         {status: fail, code: 4xx, data}
- 401         {status: fail, code: 4xx, message: string}
- 403         {status: fail, code: 4xx, message: string}
- 406         {status: fail, code: 4xx, data: {key:value}}
- 409         {status: fail, code: 4xx, data: {key:value}}
- 4xx        {status: fail, code: 4xx, message: string}
- 5xx         {status: error, code: 5xx, message: string}

## Servers

The API is hosted on Heroku on different pipelines.
As this is an API, you will be redirected to DOCS pages and test the features there


To test our stable version use the:
- Production Link : ["https://atlp-backend.herokuapp.com/"]
- Production branch : ['dev']
- Production appname : ['atlp-backend']

Wanna up the game? Check our staging pipeline here.
- Staging Pipeline: ["https://atlp-backend-staging.herokuapp.com/"]
- Staging branch: ['staged']

## How to contribute
Give us your review and comments? Check the features in development and give your 
comments on the active pull requests on GitHub
- Development Pipeline: "Depend on the branch that has a pull request"
- Development branch: ['currentDev']

Or you can just clone this project and then 
`npm install`

## Acknowledgement
I want to thank everyone who contributed a lot especially @Musinda

### Integrations
1. PivotalTracker


