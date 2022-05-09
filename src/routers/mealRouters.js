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
    console.log("data", data);
    const meals = new Meals({
      title: data.title,
      category: data.category,
      complexity: data.complexity,
      affordability: data.affordability,
      image,
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

//get my products
// mealRouter.get("/products/my", auth, async (req, res) => {
//   try {
//     const products = await Products.find({ owner: req.user._id })
//       .sort({
//         createdAt: -1,
//       })
//       .limit(2);
//     res.send(products);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

//getallproducts
mealRouters.get("/meals/all", async (req, res) => {
  try {
    const meals = await Meals.find();
    res.send(meals);
  } catch (e) {
    res.status(500).send(e);
  }
});

// //getproductsbycategory
// mealRouter.get("/products/category/:cat", async (req, res) => {
//   try {
//     const products = await Products.find({ company: req.params.cat });
//     if (!products) {
//       return res.status(404).send("No data");
//     }
//     res.send(products);
//   } catch (error) {
//     res.status(404).send(error);
//   }
// });

// //updatemyproducts
// mealRouter.patch(
//   "/products/me/:id",
//   auth,
//   upload.single("image"),
//   async (req, res) => {
//     const allowedupdates = [
//       "name",
//       "company",
//       "price",
//       "description",
//       "category",
//       "image",
//     ];

//     const updates = Object.keys({ ...req.body, image: req.file.filename });
//     const isvalidupdate = updates.every((update) =>
//       allowedupdates.includes(update)
//     );

//     if (!isvalidupdate) {
//       return res.status(404).send({ error: "invalid updates" });
//     }

//     try {
//       const products = await Products.findOne({
//         _id: req.params.id,
//         owner: req.user._id,
//       });

//       if (!products) {
//         return res.status(404).send();
//       }
//       updates.forEach((update) => {
//         products[update] = req.body[update];
//         //products[update.image] = image;
//       });
//       await products.save();
//       res.send(products);
//     } catch (error) {
//       res.status(400).send(error);
//     }
//   }
// );

// //deletemyproducts
// mealRouter.delete("/products/delete/my/:id", auth, async (req, res) => {
//   try {
//     const products = await Products.findOneAndDelete({
//       _id: req.params.id,
//       owner: req.user._id,
//     });
//     if (!products) {
//       res.status(404).send();
//     }
//     res.status(200).send(products);
//   } catch (error) {
//     res.status(500).send();
//   }
// });

module.exports = mealRouters;
