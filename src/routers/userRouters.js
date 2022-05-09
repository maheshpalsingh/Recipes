const express = require("express");
const userRouter = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
//Login
userRouter.post("/users/login", async (req, res) => {
  try {
    console.log("3");
    const user = await User.findbycredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//logout
userRouter.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send("Thankyou");
  } catch (e) {
    res.status(500).send(e);
  }
});

//logout all sessions
userRouter.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.sendStatus(500);
  }
});

//register
userRouter.post("/users/register", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//readmyprofile
userRouter.get("/users/get/me", auth, async (req, res) => {
  res.send(req.user);
  console.log(req.user);
});

//updateme
userRouter.patch("/users/update/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedupdates = ["name", "email", "age", "password", "contactno"];
  const updatesAllowed = updates.every((update) =>
    allowedupdates.includes(update)
  );
  if (!updatesAllowed) {
    return res.status(404).send();
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//resetpassword
userRouter.post("/users/reset/password", async (req, res) => {
  try {
    const data = req.body;
    const verifyemail = await User.findOne({ email: data.email });
    if (!verifyemail) {
      return res.status(400).send("Email is not found");
    }

    if (data.password !== data.confirmpassword) {
      return res.status(400).send("Password should be same");
    }

    const updatePassword = await User.findByIdAndUpdate(verifyemail._id, {
      password: await bcrypt.hash(data.password, 8),
    });

    await updatePassword.save();
    res.status(200).send("Password Updated");
  } catch (e) {
    res.status(400).send(e);
  }
});
//delete
userRouter.delete("/users/delete/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = userRouter;
