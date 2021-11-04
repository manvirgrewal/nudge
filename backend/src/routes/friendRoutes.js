const express = require("express");
const { link } = require("fs");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const User = mongoose.model("User");

const router = express.Router();
router.use(requireAuth);

//add friend
//update this later to implement friend requests
//FriendRequestschema
//https://stackoverflow.com/questions/43508901/friend-request-system-with-express-mongodb
router.post("/friends", async (req, res) => {
  const user = req.user;
  const newFriend = req.body.friendUserName;
  //check if the user that is trying to be added is actually a user
  const isUser = await User.findOne({ userName: newFriend });
  if (isUser) {
    user.friends.push(newFriend);
    res.send(user.friends);
    await user.save();
  } else {
    return res.status(422).send({ error: "This user doesn't exist" });
  }
});

//simply returns users friends list [string]
router.get("/friends", async (req, res) => {
  const myFriends = req.user.friends; //string list of users friends
  //res.send(myFriends);
  try {
    const friendsWithData = await User.find({ userName: { $in: myFriends } });
    res.send(friendsWithData);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

//delete friend
router.delete("/friends/:userName", async (req, res) => {
  const user = req.user;
  const newFriendsList = [];
  const delFriend = req.params.userName;
  try {
    user.friends.forEach((friend) => {
      if (friend != delFriend) {
        newFriendsList.push(friend);
      }
    });
    user.friends = newFriendsList;
    await user.save();
    res.send(user.friends);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
