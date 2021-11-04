const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");
var array = require("lodash/array");
const multer = require("multer");
const Group = mongoose.model("Group");
const Image = mongoose.model("Image");
const User = mongoose.model("User");
const router = express.Router();
router.use(requireAuth);

const upload = multer({
  limits: {
    fileSize: 500000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("too large"));
    }
    cb(undefined, true);
  },
});

router
  .route("/uploadMulter")
  .post(upload.single("imageData"), async (req, res, next) => {
    console.log(req.body);
    const newImage = new Image({
      imageName: req.body.name,
      imageData: req.body.uri,
    });

    await newImage
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).send({ success: "OK" });
      })
      .catch((err) => {
        res.status(422).send({
          error: err.message || "couldn't save new image",
        });
      });
  });

module.exports = router;
