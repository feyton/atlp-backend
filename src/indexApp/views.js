//This is where all business logic is handled
import path, { join } from "path";
import { responseHandler } from "../config/utils.js";
const __dirname = path.resolve();

const IndexView = (req, res) => {
  return res.redirect("/docs");
};

/* c8 ignore start */
export const getLogs = async (req, res, next) => {
  let options = {
    root: join(__dirname, "logs"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  let filename = req.params.filename;
  res.sendFile(filename, options, (err) => {
    //since heroku does not provide access to system files
    //this view will be used to retrieve the current Logs
    //TODO make sure that it secure and can only be accessed by admin.
    //TODO schedule periodics archiving of the Logs.
    if (err) {
      if (err.status == 404) {
        responseHandler(res, "fail", 404, "Resource not found");
      }
      next(err);
    }
  });
};
/* c8 ignore stop */
//add your function to export
export { IndexView };
