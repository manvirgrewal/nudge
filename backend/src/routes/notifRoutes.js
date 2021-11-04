const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();
router.use(requireAuth);

const Group = mongoose.model("Group");
const User = mongoose.model("User");

router.get("/sender", (req, res) => {
  const user = req.user;
  res.send(user.userName);
});

//returns list of tokens to send notification
router.post("/tokens", async (req, res) => {
  const id = req.body.groupId;
  try {
    Group.find({ _id: id })
      .populate("users")
      .lean()
      .exec((err, items) => {
        if (err) {
          res.send({ error: err.message || "couldn't get group members" });
        }
        const ownerName = items[0].owner;
        User.findOne({ userName: ownerName }, (err, userObj) => {
          try {
            const ownerNotifToken = userObj.notifToken;
            const tokens = [];
            for (let i = 0; i < items[0].users.length; i++) {
              //don't add token if it's the senders token
              //leave commented out for testing only
              //if (items[0].users[i].userName !== senderName) {
              tokens.push(items[0].users[i]);
              //}
            }
            //if the sender isn't the owner, append the owner as a recipient
            //if (!isOwner) {
            tokens.push({ notifToken: ownerNotifToken, userName: ownerName });
            //}

            res.send(tokens);
          } catch (err) {
            console.log(err);
          }
        });
      });
  } catch (err) {
    res.send({ error: err.message || "Couldn't retrieve group" });
  }
});

router.get("/tokens/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({ _id: id });
    res.send(user.notifToken);
  } catch (err) {
    res.send({ error: err.message || "Couldn't retrieve user's token" });
  }
});

//adds notification token to user in the backend
router.post("/register", async (req, res) => {
  const id = req.user.id;
  try {
    //tokens.push(req.body.token);
    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: { notifToken: req.body.token },
      }
    );
    res.send({ message: "Successfully registered Notif Token!" });
  } catch (err) {
    res.send({ error: err.message || "Couldn't save token!" });
  }
});

module.exports = router;
