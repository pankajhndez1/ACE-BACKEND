const express = require("express");
const { Fav } = require("../models/likeDislike");
const User = require("../models/user");
const Blog = require("../models/blog");
const favRouter = express.Router();

favRouter.get("/", async (req, res) => {
  const userLikedBlogs = await Fav.find({});

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

    let fav = await Fav.findOne({ user: userId })
      .populate({
        path: "likedBlogs", 
        populate: {
          path: "createdBy", 
          model: "user", 
        },
      })
      .populate("user");

    if (!fav) {
      fav = new Fav({ user: userId, likedBlogs: [] });
    }

    console.log(JSON.stringify(fav, null, 2));

    const alreadyLikedIndex = fav?.likedBlogs?.findIndex(
      (entry) => entry?._id?.toString() === likedBlogId
    );

    if (alreadyLikedIndex === -1) {
      fav.likedBlogs.push(likedBlogId);
      await fav.save();
      return res.status(200).json({ message: "Blog liked!" });
    } else {
      fav.likedBlogs.splice(alreadyLikedIndex, 1);
      await fav.save();
      return res.status(200).json({ message: "Blog unliked!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

favRouter.get("/:userId", async (req, res) => {
  try {
    const userId = req?.user?._id;
 

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const fav = await Fav.findOne({ user: userId })
      .populate({
        path: "likedBlogs", 
        populate: {
          path: "createdBy", 
          model: "user", 
        },
      })
      .populate("user");

  return res.status(200).json({data:fav})
 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  favRouter,
};
