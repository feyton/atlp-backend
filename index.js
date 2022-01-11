import express from "express";

const PORT = process.env.PORT || 3500;

const app = express();

app.listen(PORT, () => {
  console.log("Server started");
});
