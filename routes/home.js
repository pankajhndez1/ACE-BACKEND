const express = require("express");
const Blog = require("../models/blog");

const homeRouter = express.Router();

homeRouter.get('/',async(req,res)=>{
  const resp = await Blog.find({});
  
  return res.render("home", {
    blogs: resp,
  });
})


module.exports=homeRouter

