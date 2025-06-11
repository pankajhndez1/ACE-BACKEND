const express = require("express");
const User = require("../models/user");
const { COOKIE_NAME } = require("../constant");

const userRouter = express.Router();

userRouter.get("/signup", (req, res) => {
  return res.render("signup");
});

userRouter.post("/signup", async (req, res) => {
  console.log(req.body, "<<=====req.body");

  const { email, password, fullName } = req.body;
  const resp = await User.create({
    email: email,
    password: password,
    fullName: fullName,
  });

  return res.redirect("/");
});
userRouter.get("/signin", (req, res) => {
  return res.render("signin");
});

userRouter.post("/signin", async (req, res) => {
  console.log(req.body, "<<=====req.body");

  const { email, password } = req.body;
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    return res.render("signup");
  }

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    res.cookie(COOKIE_NAME, token).redirect("/");
  } catch (error) {
    res.render("signin", {
      error: "Incorrect password",
    });
  }

  return res.redirect("/");
});

module.exports = userRouter;
