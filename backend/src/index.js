require("./models/User");
require("./models/Group");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const notifRoutes = require("./routes/notifRoutes");
const friendRoutes = require("./routes/friendRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();

app.use(express.json({ limit: "15MB" }));
app.use(express.urlencoded({ extended: true }));
app.use(authRoutes);
app.use(groupRoutes);
app.use(notifRoutes);
app.use(friendRoutes);
const mongoURI =
  "mongodb+srv://admin:passwordpassword@pushr.egztl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance :)");
});

mongoose.connection.on("error", (err) => {
  console.log("There was an error connecting to mongo instance :/", err);
});

app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
