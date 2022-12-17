const express = require("express");
const instaclone = require("../models/postSchema");
const router = express.Router();
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
router.use(express.json());
router.use(bodyParser.json());

// config cloudinary
cloudinary.config({
  cloud_name: "dhob4oruk",
  api_key: "481398383545777",
  api_secret: "yvbqbmVZahHSuCaFlE0eZ-bLlwc",
  secure: true,
});
router.get("/posts", async (req, res) => {
  const posts = await instaclone.find();
  try {
    res
      .status(200)
      .json({ status: "Data Fetched Successfully", Result: posts });
  } catch (e) {
    res.status(400).json({ status: "Data Fetched failed", message: e.message });
  }
});
router.post("/posts", async (req, res, next) => {
  //   console.log(req.file);
  const file = req.files.image;
  cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
    // console.log(result);
    console.log(result);
    const posts = await instaclone.create({
      image: result.original_filename + result.format,
      imageUrl: result.url,
      likes: Math.floor(Math.random() * 10000),
      date: Date.now(),
      ...req.body,
    });
    posts
      .save()
      .then(() => {
        console.log("Post Has been Saved");
      })
      .catch((e) => {
        console.log(e.message);
      });
    console.log(posts);
    try {
      res.status(200).json({ status: "Posted Successfully", Result: posts });
    } catch (e) {
      res.status(400).json({ status: "Failed", message: e.message });
    }
  });
});
router.put("/posts/:id", async (req, res) => {
  const posts = await instaclone.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  if (!posts) {
    return res
      .status(403)
      .json({ status: "Failed", Result: "No Post available" });
  }
  try {
    res
      .status(200)
      .json({ status: "Data Updated Successfully", Result: posts });
  } catch (e) {
    res.status(400).json({ status: "Upadtion failed", message: e.message });
  }
});
router.delete("/posts/:id", async (req, res) => {
  const posts = await instaclone.deleteOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  if (!posts) {
    return res.status(403).json({
      status: "Failed",
      Result: "Can not delete because No Post available",
    });
  }
  try {
    res.status(200).json({ status: "Deleted Successfully", Result: posts });
  } catch (e) {
    res.status(400).json({ status: "Deleted failed", message: e.message });
  }
});

module.exports = router;
