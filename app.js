// require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const md5 = require("md5");

// const encrypt = require("mongoose-encryption");




//*************mongoose.connection **********
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const app = express();


app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");




//*************mongoose.Schema**********
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    
});


//*************Encryption*********

// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password","address"]});



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
    const newUser = new User ({
        email: req.body.username,
        //**********Hashing Password**********
        password: md5(req.body.password),
        
    });

   newUser.save().then(function(){
        res.render("secrets");
   }).catch(function(err){
    console.log(err);
   });
});





app.post("/login",function(req,res){
    const email = req.body.username;
    const password = md5(req.body.password);
    
   
        User.findOne({email:email}).then(function(found){
            if(found){
                if (found.password == password){
                    res.render("secrets");
                }
                else{
                    console.log("password not match");
                    res.redirect("/login");
                }
    
            }
            if (!found){
                console.log("please register youself");
                res.redirect("/login");
            }
        }).catch(function(err){
            console.log(err);
        });
    }
  
);




app.listen("3000",function(){
    console.log("server is ready");
});