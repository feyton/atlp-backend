//This is where all business logic is handled
import fs from "fs";
import path, { join, dirname } from "path";
const __dirname = path.resolve();

const IndexView = (req, res) => {
  return res.redirect("/docs");
};


export const getLogs = async (req, res, next) => {
  let options = {
    root: join(__dirname, "logs"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  let filename = req.params.id;
  res.sendFile(filename, options, (err) => {
    //since heroku does not provide access to system files
    //this view will be used to retrieve the current Logs
    //TODO make sure that it secure and can only be accessed by admin.
    //TODO schedule periodics archiving of the Logs.
    if (err) {
      if (err.status == 404) {
        return res.status(404).json({
          status: "fail",
          code: 404,
          message: "Resource not found",
        });
      }
      next(err);
    }
    console.log("File sent");
  });
};
//add your function to export
export { IndexView };
