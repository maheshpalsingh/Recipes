const mongoose = require("mongoose");
const validator = require("validator");
const MealsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: [{ type: String, required: true, trim: true }],
    complexity: { type: String, required: true, trim: true },
    affordability: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    bg: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      trim: true,
    },

    ingredients: [
      {
        type: String,
        required: true,
      },
    ],
    steps: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    isGlutenFree: {
      type: String,
      required: true,
      trim: true,
    },
    isVegan: {
      type: String,
      required: true,
      trim: true,
    },
    isVegetarian: {
      type: String,
      required: true,
      trim: true,
    },
    isLactoseFree: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);
const Meals = mongoose.model("Meals", MealsSchema);

module.exports = Meals;
