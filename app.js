const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv-safe").config();

const { mongodb_url } = require("./src/utils/config");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes

// Error handling
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

app.use((req, res) => {
  res.status(404).json({ message: "Invalid URL" });
});

mongoose.set("useFindAndModify", false);
mongoose
  .connect(mongodb_url, { useNewUrlParser: true })
  .then(() => {
    port = process.env.PORT || 3000;
    app.listen(port);
    console.log("Listening on port " + port);
  })
  .catch(err => {
    console.log("Mongodb error: " + err);
  });
