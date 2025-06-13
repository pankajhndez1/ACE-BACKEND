const mongoose = require("mongoose");

const likedBlogsSchema = new mongoose.Schema(
  {
    likedBlogs: [
      {
        blog: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "blog", 
          required: true,
        },
      }
    ]
  },
  { timestamps: true }
);

const Fav = mongoose.model("favourites", likedBlogsSchema);

module.exports = {
  Fav,
};
