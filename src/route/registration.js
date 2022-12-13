const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../Model/user");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const secret = "MySecretCode";
router.use(bodyparser.json());
router.post(
  "/register",
  body("email").isEmail(),
  // password must be at least 6 chars long
  body("password").isLength({ min: 6, max: 16 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({
          errors: errors.array(),
        });
      }
      const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res.json({
          Status: "Registration Failed",
          message: "User Already Exist",
        });
      }
      bcrypt.hash(password, 10, async function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          return res
            .status(403)
            .json({ status: "Failed", message: err.message });
        }
        user = await User.create({
          name: name,
          email: email,
          password: hash,
        });
        res
          .status(200)
          .json({ status: "Registration Successfull", Result: user });
      });
    } catch (e) {
      res.status(400).json({ status: "Failed", Message: e.message });
    }
  }
);
router.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ Status: "User Does Not Exist" });
  }
  try {
    bcrypt.compare(password, user.password, async function (err, result) {
      // result == true
      if (err) {
        return res.status(500).json({ status: "Failed", message: err.message });
      }

      if (result) {
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: user._id,
          },
          secret
        );
        res.status(200).json({
          status: "Success",
          message: "Login Successfully",
          token: token,
        });
      } else {
        res
          .status(403)
          .json({ status: "Failed", message: "403 Forbidden Request" });
      }
    });
  } catch (e) {
    res.status(400).json({ status: "Failed", Message: e.message });
  }
});

module.exports = router;
