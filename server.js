require("dotenv").config({ path: "./config.env" });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const dbo = require("./db/conn");

const port = 4000;
const app = express();

app.use((req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403);
    }

    req.user = user;
    next();
  });
});

app.use(cors());
app.use(express.json());
app.use(require("./routes/crud"));
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(function (err, _req, res) {
//   console.err(err.stack);
//   res.status(500).send("Internal Server Error!");
// });

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
