const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../Model/user");
const { body, validationResult } = require("express-validator");
router.use(bodyparser.json());
router.get("/", async (req, res) => {
  const user = await User.find();
  try {
    res.status(200).json({ status: "Success", Result: user });
  } catch (e) {
    res.status(400).json({ status: "Failed", Message: e.message });
  }
});
router.get("/:id", async (req, res) => {
  const user = await User.find({ _id: req.params.id });
  try {
    res.status(200).json({ status: "Success", Result: user });
  } catch (e) {
    res.status(400).json({ status: "Failed", Message: e.message });
  }
});
// router.post(
//   "/",
//   body("email").isEmail(),
//   // password must be at least 6 chars long
//   body("password").isLength({ min: 6, max: 16 }),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.json({
//         errors: errors.array(),
//       });
//     }
//     const user = await User.create(req.body);
//     try {
//       res.status(200).json({ status: "Success", Result: user });
//     } catch (e) {
//       res.status(400).json({ status: "Failed", Message: e.message });
//     }
//   }
// );
router.put("/", async (req, res) => {
  // for update use queryparams-->users?email=Sumitku70@gamil.com&password=123456
  const userExist = await User.findOne(
    { email: req.query.email },
    { password: req.query.password }
  );
  //   console.log(userExist);
  if (!userExist) {
    res
      .status(400)
      .json({ status: "Failed", Message: "User Email or Password Wrong" });
  }
  try {
    const user = await User.updateOne(
      { email: req.query.email },
      { $set: req.body }
    );
    res.status(200).json({ status: "User Updated Successfully", Result: user });
  } catch (e) {
    res.json({ status: "Failed", Message: e.message });
  }
});
router.delete("/", async (req, res) => {
  const userExist = await User.find(
    { email: req.query.email },
    { password: req.query.password }
  );

  if (!userExist) {
    res
      .status(400)
      .json({ status: "Failed", Message: "User Email or Password Wrong" });
  }
  try {
    const user = await User.deleteOne({ email: req.query.email });
    res.status(200).json({ status: "User Deleted", Result: user });
  } catch (e) {
    res.json({ status: "Failed", Message: e.message });
  }
});

module.exports = router;
