// require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
// const encryption = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");

const saltRound = 10;

//*************mongoose.connection **********
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const app = express();

// Use body-parser middleware
app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static("public"));
app.set("view engine","ejs");

//*************mongoose.Schema**********
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    
});

//***********mongoose.Collection*********
const User = new mongoose.model("user",userSchema);

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

//**********post routes**********
app.post("/register",function(req,res){

   
        //**********Hashing Password using hashing + saltround**********
        const email = req.body.username;
        bcrypt.hash(req.body.password,saltRound,function(req,hash){
            const newUser = new User({
                email: email,
                password: hash
            });
            newUser.save();
            res.render("login");
        });
   
   
});

app.post("/login",function(req,res){

    const email = req.body.username;
    const password = req.body.password;

    User.findOne({email:email}).then(function(found){
        if (found){
            bcrypt.compare(password,found.password,function(req,result){
                if (result){
                    res.render("secrets");
                }
                else{
                    console.log("passowrd not found");
                }
                
            });

        }
        if (!found){
            console.log("you must regirster first");
            res.redirect("/register");
        }
    });


    // const email = req.body.username;
    // const password = md5(req.body.password);
    
    // User.findOne({email:email}).then(function(found){
           
    //     if(found){
    //     if (found.password == password){
    //         res.render("secrets");
    //     }
          
    //     }
    //     if (!found){
    //         console.log("please register yourself");
    //         res.redirect("/register");
    //     }
    // }).catch(function(err){
    //     console.log(err);
    // });
});

app.listen("3000",function(){
    console.log("server is ready");
});
