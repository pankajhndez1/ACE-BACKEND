const express = require("express");

const homeRouter = express.Router();

homeRouter.get('/',(req,res)=>{
   return res.render('home')
})


module.exports=homeRouter

