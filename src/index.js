const express = require("express");
require("./db/mongoose.js");
const app = express();
const port = process.env.PORT || 3000;

const user = require("./routers/userRouters");
const meals = require("./routers/mealRouters");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.json());
app.use(user);
app.use(meals);

app.use("/profile", express.static("uploads/images"));

app.listen(port, () => {
  console.log(`Server is up on ${port} port`);
});
