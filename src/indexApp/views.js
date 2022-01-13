//This is where all business logic is handled
//Equivalent to middleware. Create functions that process request here
//Remember to import all in routes
import * as models from "./models.js";

const IndexView = (req, res) => {
  return res.json({
    message: "Welcome. To Access the docs, please refer to the /docs path",
  });
};

//add your function to export
export { IndexView };
