const express = require("express");
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const blogRouter = express.Router();



blogRouter.get("/", async (req, res) => {
  const resp = await Blog.find({});
  console.log(resp,'resp')
  return res.render("home", {
    blogs: resp,
  });
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

blogRouter.get("/signUp", (req, res) => {
  return res.render("signUp");
});

blogRouter.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageUrl: `/uploads/${req?.file?.filename}`,
  });

  return res.redirect(`blog/${blog._id}`);
});

blogRouter.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

blogRouter.get("/:id", async (req, res) => {
  const blogId = req?.params?.id;
  const blog = await Blog.findById(blogId).populate("createdBy");
  const comments = await Comment.find({blogId:blogId}).populate("createdBy")

  return res.render("blog",{
   user:req.user,
   blog,
   comments
  });
});

blogRouter.post("/comment/:blogId", async (req, res) => {
  const blogId = req.params.blogId;

 const resp= await Comment.create({
   blogId,
   createdBy:req.user._id,
   content:req.body.content
  })

  return  res.redirect(`/blog/${req.params.blogId}`);
});

blogRouter.get("/signIn", (req, res) => {
  return res.render("signIn");
});

module.exports = blogRouter;



