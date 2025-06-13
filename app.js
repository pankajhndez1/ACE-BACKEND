const mongoose = require("mongoose");
const express = require("express");
const path =require("path")
const cookieParser =require("cookie-parser");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const homeRouter = require("./routes/home");
const { checkForAuthenticationCookie } = require("./middleware");
const { COOKIE_NAME } = require("./constant");
const { favRouter } = require("./routes/favourites");
const app = express();
const PORT = 8000;
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie(COOKIE_NAME))
const DB_NAME = "ACE";
mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`).then(() => {
  console.log("connected to mongodb!!");
});
app.use(express.static(path.resolve('./public')))
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use('/user',userRouter);
app.use('/blog',blogRouter);
app.use('/',homeRouter)
app.use('/fav',favRouter)
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
