const express = require("express");

const mealRouters = express.Router();
const auth = require("../middleware/auth");
const Meals = require("../models/meals");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Invalid extensions"));
    }
    cb(undefined, true);
  },
});

//registerproduct
mealRouters.post(
  "/meals/add",
  auth,
  upload.single("profile"),
  async (req, res) => {
    const image = `http://10.0.2.2:3000/profile/${req.file.filename}`;
    const data = req.body;
    const meals = new Meals({
      title: data.title,
      category: data.category,
      complexity: data.complexity,
      affordability: data.affordability,
      image,
      bg: data.bg,
      duration: data.duration,
      ingredients: data.ingredients,
      steps: data.steps,
      isGlutenFree: data.isGlutenFree,
      isVegan: data.isVegan,
      isVegetarian: data.isVegetarian,
      isLactoseFree: data.isLactoseFree,
      owner: req.user._id,
    });
    try {
      await meals.save();
      res.status(201).send({ meals });
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

//getallproducts
mealRouters.get("/meals/all", async (req, res) => {
  try {
    const meals = await Meals.find();
    res.send(meals);
  } catch (e) {
    res.status(500).send(e);
  }
});

//getproductsbycategory
mealRouters.get("/meals/bycategory/:cat", async (req, res) => {
  try {
    const meals = await Meals.find({ category: req.params.cat });
    if (!meals) {
      return res.status(404).send("No data");
    }
    res.send(meals);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = mealRouters;
