const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const UserRoutes = require("./src/route/Users");
const postRoutes = require("./src/route/post");
const RegistrationRoutes = require("./src/route/registration");
const jwt = require("jsonwebtoken");
const secret = "MySecretCode";
const port = 3000;
const app = express();
app.use(express.json());
app.use(bodyparser.json());
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost/assignment", () => {
  console.log("Connected to Database");
});
app.use("/api/v1/posts", (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization?.split("Secure ")[1];
    if (token) {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          return res
            .status(403)
            .json({ status: "Failed", message: err.message });
        }
        // console.log(decoded);
        // console.log(token);

        req.user = decoded.data;
        next();
      });
    } else {
      return res.status(403).json({
        status: "Failed",
        message: "Invalid Token ",
      });
    }
  } else {
    return res.status(403).json({
      status: "Failed",
      message: "Token Missing",
    });
  }
});
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/users", RegistrationRoutes);
app.use("/api/v1", postRoutes);
app.get("*", (req, res) => {
  res.status(404).send("404!! Page Not Found");
});
app.listen(port, (e) => {
  console.log(`Server is running at port ${port}`);
});
