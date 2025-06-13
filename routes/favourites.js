const express = require("express");
const { Fav } = require("../models/likeDislike");
const User = require("../models/user");

const favRouter = express.Router();

favRouter.get("/", async (req, res) => {
  const userLikedBlogs = await Fav.find({});
  console.log(userLikedBlogs, "<<===userLikedBlogs");

  return res.status(200).json({
    data: userLikedBlogs,
  });
});

favRouter.post("/:blogId", async (req, res) => {
  try {
    const userId = req?.user?._id;
    const likedBlogId = req.params.blogId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Find or create the user's favourites document
    let fav = await Fav.findOne({ user: userId });
    if (!fav) {
      fav = new Fav({ user: userId, likedBlogs: [] });
    }

    // Check if already liked
    const alreadyLikedIndex = fav.likedBlogs.findIndex(
      (entry) => entry.blog.toString() === likedBlogId
    );

    if (alreadyLikedIndex === -1) {
      // NOT liked yet => Add to likedBlogs
      fav.likedBlogs.push({ blog: likedBlogId });
      await fav.save();
      return res.status(200).json({ message: "Blog liked!" });
    } else {
      // ALREADY liked => Remove from likedBlogs
      fav.likedBlogs.splice(alreadyLikedIndex, 1);
      await fav.save();
      return res.status(200).json({ message: "Blog unliked!" });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  favRouter,
};
