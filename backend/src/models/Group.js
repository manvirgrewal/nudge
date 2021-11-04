const mongoose = require("mongoose");
//users.push(User._id);

const groupSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      require: true,
    },
    owner: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      default: "",
      require: true,
    },
    users: { type: {}, require: true },
    avatarURL: { type: String, default: "" },
    pinned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

mongoose.model("Group", groupSchema);
