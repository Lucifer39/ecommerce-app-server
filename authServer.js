require("dotenv").config({ path: "./config.env" });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const dbo = require("./db/conn");

const port = 4001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(require("./routes/auth"));
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(function (err, _req, res) {
//   console.error(err.stack);
//   res.status(500).send("Internal server error");
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
