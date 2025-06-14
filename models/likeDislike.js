const mongoose = require("mongoose");

const likedBlogsSchema = new mongoose.Schema(
  {
    likedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogs",
        required: true,
      },
    ],
     user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const Fav = mongoose.model("favourites", likedBlogsSchema);

module.exports = {
  Fav,
};
