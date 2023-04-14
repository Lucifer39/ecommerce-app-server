const express = require("express");
const getRoute = express.Router();
const fs = require("fs");
const multer = require("multer");
const upload = multer();

const dbo = require("../db/conn");

getRoute.route("/get/getProducts").get(async function (req, res) {
  const dbConnect = dbo.getDb();

  try {
    dbConnect
      .collection("products")
      .find({})
      .toArray(function (err, result) {
        if (err) res.status(400).send("Error fetching products!");
        else if (result.length == 0) res.status(204).send("No products found");
        else res.status(200).send(result);
      });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

getRoute.route("/get/getProduct").get(async function (req, res) {
  const dbConnect = dbo.getDb();
  const productId = req.query.id;

  try {
    dbConnect
      .collection("products")
      .find({ productId })
      .toArray(function (err, result) {
        if (err) res.status(400).send("Error fetching products!");
        else res.status(200).send(result);
      });
  } catch (error) {
    res.status(400).send("Critical Error!");
  }
});

getRoute.route("/get/getVariantClass").get(async function (req, res) {
  const dbConnect = dbo.getDb();
  const className = req.query.name;

  try {
    dbConnect
      .collection("variantClasses")
      .find({ className })
      .toArray(function (err, result) {
        if (err) res.status(400).send("Error fetching products!");
        else res.status(200).send(result);
      });
  } catch (error) {
    res.status(400).send("Critical Error!");
  }
});

module.exports = getRoute;
