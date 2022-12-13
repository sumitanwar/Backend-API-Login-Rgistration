const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const router = express.Router();
const Blogs = require("../Model/post");
const jwt = require("jsonwebtoken");
router.use(bodyparser.urlencoded({ extended: false }));
router.use(bodyparser.json());
router.post("/posts", async (req, res) => {
  //   return res.send("Ok");

  try {
    const Post = await Blogs.create({
      title: req.body.title,
      body: req.body.body,
      image: req.body.image,
      user: req.user,
    });
    res.json({ status: "Post Created Successfully", Result: Post });
  } catch (e) {
    res.status(400).json({ status: "Failed", Message: e.message });
  }
});
router.get("/posts", async (req, res) => {
  //   return res.send("Ok");

  try {
    const Posts = await Blogs.find();
    res.json({ status: "Post Fetched Successfully", Result: Posts });
  } catch (e) {
    res.status(400).json({ status: "Failed", Message: e.message });
  }
});
router.put("/posts/:id", async (req, res) => {
  //   return res.send("Ok");
  const ExistingPost = await Blogs.find({ _id: req.params.id });
  if (!ExistingPost) {
    return res.json({
      status: "Failed",
      Message: "No Post Available for this User",
    });
  }
  const Posts = await Blogs.updateOne({ ...ExistingPost, ...req.body });
  try {
    res
      .status(200)
      .json({ status: "Post Updated Successfully", Result: Posts });
  } catch (e) {
    res.status(400).json({ status: "Failed", Message: e.message });
  }
});
router.delete("/posts/:id", async (req, res) => {
  //   return res.send("Ok");
  const ExistingPost = await Blogs.find({ _id: req.params.id });
  if (!ExistingPost) {
    return res.json({
      status: "Failed",
      Message: "No Post Available for this User",
    });
  }
  const Posts = await Blogs.deleteOne({ _id: req.params.id });
  try {
    res.status(200).json({ status: "Post Deleted Successfully" });
  } catch (e) {
    res.status(400).json({ status: "Failed", Message: e.message });
  }
});
module.exports = router;
