const dotenv = require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
//*************requiring sessions **********
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");









const app = express();

// Use body-parser middleware
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");



//*************after requiring the express-session we set up our session **********
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true
}));
//*************this is a method that start inializing for authentication **********
app.use(passport.initialize());
//*************this method tells our app to use passport to set up our session **********
app.use(passport.session());


//*************mongoose.connection **********
mongoose.connect("mongodb://127.0.0.1:27017/userDB");



//*************mongoose.Schema**********
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    
});

//*************this method is used to hash and sald our passwords and to save our users in our database **********

userSchema.plugin(passportLocalMongoose);



//***********mongoose.Collection*********
const User = new mongoose.model("user",userSchema);

//**********passport serialize is used to to create a coockie **********
// passport.serializeUser(User.serializeUser());
// //**********passport.deserialze is used to destroy the cookie**********
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
  

//**********get routes**********
app.get("/",function(req,res){
    res.render("home");    
});

app.get("/login",function(req,res){
    res.render("login");    
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/secrets",function(req,res){
    
    res.render("secrets");
    // if (req.isAuthenticated()){
    //     res.render("secrets");
    // }
    // else{
    //     res.redirect("/login");
    // }
});

app.get("/logout",function(req,res){
    req.logOut(function(err){
        if (err){
            console.log(err);
        }
        
    });
    res.redirect("/");
});

//**********post routes**********
app.post("/register",function(req,res){

   User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
        console.log(err);
        res.redirect("/register");
    }
    else{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        });
    }
   });
     
   
   
});

app.post("/login",function(req,res){

   const user = new User({
    email: req.body.username,
    password: req.body.password
   });

   req.login(user,function(err){
    if (err){
        console.log(err);
    }
    else {
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        });
    }
   });

});

app.get("/delete",function(req,res){
    User.deleteMany().then(function(){
        console.log("data deleted successfulyy");
    });
    res.redirect("/");
});

// app.get("/delete/:delete",function(req,res){
//     User.deleteMany({email:req.params.delete});
//     res.redirect("/");
// });

app.listen("3000",function(){
    console.log("server is ready");
});
