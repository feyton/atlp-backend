export const dbError = (res, message = "Unable to connect to the database") => {
  return res.status(500).json({
    status: "error",
    code: 500,
    message: message,
  });
};

export const serverError = (res) => {
  return res.status(500).json({
    status: "error",
    code: 500,
    message: "Something went wrong on our end",
  });
};

export const forbidenAccess = (
  res,
  message = "You don't have access to the requested resource"
) => {
  return res.status(403).json({
    status: "fail",
    code: 403,
    message: message,
  });
};

export const resourceNotFound = (res) => {
  return res.status(404).json({
    status: "fail",
    message: "Not found",
    code: 404,
  });
};

export const successResponseNoData = (res) => {
  return res.status(200).json({
    status: "success",
    code: 200,
    data: null,
  });
};

export const successResponse = (res, data) => {
  return res.status(200).json({
    status: "success",
    code: 200,
    data: data,
  });
};

export const badRequestResponse = (
  res,
  message = "Invalid/ Missing required parameters"
) => {
  return res.status(400).json({
    status: "fail",
    code: 400,
    message: message,
  });
};

// todo combine all functions into one
