const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require('./db/dbConnect')
const bcrypt = require('bcrypt')
const User = require('./db/userModel')
const jwt = require("jsonwebtoken")
const auth = require('./auth')
dbConnect();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.json({ message: "Hey! This is your server response!" });
  next();
});

// register
app.post("/register", (request, response) => {
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});


// login 
app.post("/login", (request, response) => {
  
  User.findOne({ email: request.body.email })

    .then((user) => {
      bcrypt
        .compare(request.body.password, user.password)

        .then((passwordCheck) => {

          if(!passwordCheck) {
            return response.status(400).send({
              message: "Passwords do not match",
              error,
            });
          }

          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "12h" }
          );

          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e
      });
    });
});

app.get("/about", (req, res)=>{
  res.json({message: "About Page"})
})

app.get("/connect", auth, (request, response) => {
  response.json({ message: "Authorized access" });
})



module.exports = app;
