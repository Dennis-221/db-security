//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});


app.get("/register", function(req, res){
  res.render("register");
});

//Connect to database on local system
mongoose.connect("mongodb://localhost:27017/userDB");

//Create a Schema
const userSchema = mongoose.Schema({
  userName: String,
  password: String
});

//Before creating the model bind your plugins
//const secretOurs = "Thisisourlittlesecret."
//userSchema.plugin(encrypt, {secret: secretOurs, encryptedFields: ['password'] });
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });
console.log(process.env.API_KEY);

//Create a model to use that Schema
const User = mongoose.model("User", userSchema);

//Hnadle possts on login nand register
app.post("/register", function(req, res){
  const newUser = new User({
      userName: req.body.username,
      password: req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      res.redirect("/");
    }
  });
});

app.post("/login", function(req, res){
  User.findOne({userName: req.body.username},function(err, foundRec){
    if(foundRec){
      if(foundRec.password === req.body.password){
        res.render("secrets");
      }else{
        res.redirect("/");
      }
    }else{
      res.redirect("/");
    }
  });
});

app.listen(3000, function(req, res){
  console.log("Server started on port 3000");
})
