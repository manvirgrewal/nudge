const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");
var array = require("lodash/array");
const Group = mongoose.model("Group");
const User = mongoose.model("User");
const router = express.Router();
router.use(requireAuth);

//upload image
//&& sets group.avatarURL
router.post("/uploadGroupImage/:id", async (req, res) => {
  const image = req.body.image;
  const src = req.body.source;

  const id = req.params.id;
  try {
    Group.findOne({ _id: id }, async (err, groupObj) => {
      groupObj.avatarURL = src;
      groupObj.image = image;
      groupObj.markModified("avatarURL");
      groupObj.markModified("image");
      await groupObj.save();
    });
  } catch (err) {
    console.log(err);
    res.send({ error: err.message || "Couldn't set group Image" });
  }
});

//retrieve all groups
router.get("/groups", async (req, res) => {
  const pinnedGroups = req.user.pinnedGroups;
  const ownedGroups = await Group.find({ owner: req.user.userName });
  const inGroups = await Group.find({ "users.userName": req.user.userName });
  const allGroups = ownedGroups.concat(inGroups);

  const allGroupsPinned = [];
  pinnedGroups.forEach((group) => {
    for (let i = 0; i < allGroups.length; i++) {
      let aG = allGroups[i];
      if (group._id === aG._id) {
        //console.log(group.name + " is the same as " + aG.name);
        allGroups.splice(i, 1); //cut out the iTh element from original
        aG.pinned = true;
        allGroupsPinned.push(aG); //add it to the new array
      } else {
        aG.pinned = false;
      }
    }
  });
  const updatedGroups = allGroupsPinned.concat(allGroups);
  res.send(updatedGroups);
});

//sets group.avatarURL
router.post("/groupsImage/:groupId", (req, res) => {
  const id = req.params.groupId;
  const location = req.body.location;
  //console.log(id, location);
  if (location !== null) {
    try {
      Group.findOne({ _id: id }, async (err, groupObj) => {
        groupObj.avatarURL = location;
        groupObj.markModified("avatarURL");
        await groupObj.save();
      });
    } catch (err) {
      console.log(err);
      res.send({ error: err.message || "Couldn't set group Image" });
    }
  } else {
    console.log("location/avatarURL was null");
  }
});

//add user(s) to group, plus adds the groupId to the users' group array
router.post("/groups/:id", (req, res) => {
  const id = req.params.id;
  const users = req.body.users;
  try {
    users.forEach((user) => {
      //find specific user in Users
      User.findOne({ userName: user }, async (err, userObj) => {
        //find the specific group in Groups and update it, with the users userName and notifToken
        await Group.findOneAndUpdate(
          { _id: id },
          {
            $push: {
              users: {
                notifToken: userObj.notifToken,
                userName: userObj.userName,
              },
            },
          }
        );
        //add group id to users' groups array
        userObj.groups.push(id);
        await userObj.save().catch((err) => {
          console.log(err);
          res.send({ error: err.message || "couldn't save userObj" });
        });
      });
    });
    res.send({ message: "Added users: " + users });
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: err.message });
  }
});

router.get("/user", async (req, res) => {
  res.send(req.user.userName);
});

//make group
router.post("/groups", async (req, res) => {
  const { name, groupId, url } = req.body;
  if (!name) {
    return res.status(422).send({
      error: "You must provide a group name.",
    });
  }
  try {
    const group = new Group({
      _id: groupId,
      owner: req.user.userName,
      name,
      users: [],
      avatarURL: url,
    });
    await group.save();
    res.send(group);
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: err.message });
  }
});

//delete a group member
router.delete("/groups/:id/:userName", async (req, res) => {
  const id = req.params.id;
  const userName = req.params.userName;
  const newMemberList = [];
  try {
    Group.findOne({ _id: id }, async (err, groupObj) => {
      groupObj.users.forEach((user) => {
        if (user.userName != userName) {
          newMemberList.push(user);
        }
      });
      groupObj.users = newMemberList;
      await groupObj.save();
      res.send(groupObj.users);
    });
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: err.message });
  }
});

//changes a groups name
router.put("/groups/:id/:name", async (req, res) => {
  const id = req.params.id;
  const newName = req.params.name;
  try {
    await Group.findOneAndUpdate(
      { _id: id },
      {
        $set: { name: newName },
      }
    );
    res.send({ message: "group name changed to " + newName });
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: err.message });
  }
});

//adds group to user's pinnedGroups array and sets pinned to true
router.put("/pinnedGroup/:id", async (req, res) => {
  const id = req.params.id;
  const { pinned } = req.body;
  //console.log(id, pinned);
  if (pinned) {
    try {
      User.findOne({ userName: req.user.userName }, async (err, userObj) => {
        const group = await Group.findOne({ _id: id });
        console.log(group.name);
        group.pinned = true;
        userObj.pinnedGroups.push(group);
        await userObj.save();
        res.send(userObj.pinnedGroups);
      });
    } catch (err) {
      console.log(err);
      res.send({ error: err.message || "error adding pinned group" });
    }
  } else {
    try {
      User.findOne({ userName: req.user.userName }, async (err, userObj) => {
        //remove pinned group from users' pinned groups array
        const updatedPinnedGroups = array.remove(
          userObj.pinnedGroups,
          (group) => {
            return String(group._id) != id;
          }
        );
        userObj.pinnedGroups = updatedPinnedGroups;
        userObj.markModified("pinnedGroups");
        await userObj.save();

        res.send(userObj.pinnedGroups);
      });
    } catch (err) {
      console.log(err);
      res.send({ error: err.message || "error removing pinned group" });
    }
  }
});

//fetch's all pinned groups associated with user
router.get("/pinnedGroup", async (req, res) => {
  try {
    User.findOne({ userName: req.user.userName }, async (err, userObj) => {
      res.send(userObj.pinnedGroups);
    });
  } catch (err) {
    console.log(err);
    res.send({ error: err.message || "error fetching pinned groups" });
  }
});

//delete group
router.delete("/groups/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Group.deleteOne({ _id: id });
    User.findOne({ userName: req.user.userName }, async (err, userObj) => {
      //remove pinned group from users' pinned groups array
      const updatedPinnedGroups = array.remove(
        userObj.pinnedGroups,
        (group) => {
          return String(group._id) != id;
        }
      );
      userObj.pinnedGroups = updatedPinnedGroups;
      userObj.markModified("pinnedGroups");
      await userObj.save();
    });
    res.send({ message: "Deleted group with id: " + id });
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
