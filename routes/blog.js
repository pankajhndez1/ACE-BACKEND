const express = require("express");

const blogRouter = express.Router();

blogRouter.get('/signUp',(req,res)=>{
   return res.render('signUp')
})

blogRouter.get('/signIn',(req,res)=>{
   return res.render('signIn')
})


module.exports=blogRouter

