# atlp-backend
The backend code for the ATLP Project.

# General description


# Responses:
Expect the following response structures:
code        Response structure
2xx         {status: success, code: 2xx, data: {objectKey: Value}}
400         {status: fail, code: 4xx, data}
401         {status: fail, code: 4xx, message: string}
403         {status: fail, code: 4xx, message: string}
406         {status: fail, code: 4xx, data: {key:value}}
409         {status: fail, code: 4xx, data: {key:value}}
4xx        {status: fail, code: 4xx, message: string}
5xx         {status: error, code: 5xx, message: string}

# Servers

The API is hosted on Heroku on different pipelines.
As this is an API, you will be redirected to DOCS pages and test the features there

To test our stable version use the 
-- Production Link : ["https://atlp-backend.herokuapp.com/"]
-- Production branch : ['dev']
-- Production appname : ['atlp-backend']

Wanna up the game? Check our staging pipeline here.
-- Staging Pipeline: ["https://atlp-backend-staging.herokuapp.com/"]
-- Staging branch: ['staged']

Give us your review and comments? Check the features in development and give your 
comments on the active pull requests on GitHub
-- Development Pipeline: [Depend on the branch that has a pull request]
-- Development branch: ['currentDev']