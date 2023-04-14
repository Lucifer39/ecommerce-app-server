const express = require("express");
const authRoute = express.Router();
const jwt = require("jsonwebtoken");

const dbo = require("../db/conn");

let refreshTokens = [];

authRoute.route("/login").post(async function (req, res) {
  const dbConnect = dbo.getDb();

  const username = req.body.username;
  const password = req.body.password;

  console.log(username);

  try {
    dbConnect
      .collection("users")
      .find({ name: username, password })
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching user!");
        } else if (result.length == 0) {
          res.status(204).send("No user found");
        } else {
          const user = { user: username };
          const accessToken = generateAccessToken(user);

          const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);

          refreshTokens.push(refreshToken);

          res.status(200).json({ accessToken, refreshToken });
        }
      });
  } catch (error) {
    // console.log(error);
    res.status(400).send("No user found");
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "24h" });
}

authRoute.route("/token").post(async function (req, res) {
  const refreshToken = req.body.token;

  if (refreshToken == null) return res.status(401);

  if (!refreshTokens.includes(refreshToken)) return res.status(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) res.status(403);

    const accessToken = generateAccessToken({ user: user.user });

    res.json({ accessToken });
  });
});

authRoute.route("/login/logout").delete(async function (req, res) {
  refreshTokens = refreshTokens.filter((token) => token != req.body.token);
  res.status(200).send();
});

authRoute.route("/signup").post(async function (req, res) {
  const dbConnect = dbo.getDb();

  const username = req.body.username;
  const password = req.body.password;

  try {
    const rec = await dbConnect.collection("users").insertOne({ name: username, password });
    console.log("1 document inserted");
    res.status(200).send(rec.insertedId);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error!");
  }
});

module.exports = authRoute;
