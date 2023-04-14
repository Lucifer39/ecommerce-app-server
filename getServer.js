require("dotenv").config({ path: "./config.env" });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const dbo = require("./db/conn");

const port = 4002;
const app = express();

app.use(cors());
app.use(express.json());
app.use(require("./routes/getApi"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((error, request, response, next) => {
  response.status(500).end();
});

dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
