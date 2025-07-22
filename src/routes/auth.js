const express = require("express");
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

authRouter.post("/signup", async function (req, res) {
  // validation of the data

  // encryption of the password can be done here

  // creating a new instance of User model
  // and saving it to the database

  try {
    // Validate the request body
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Hash the password before saving
    const passwordHash = await bcrypt.hash(password, 10);
    req.body.password = passwordHash; // replace the plain password with the hashed one
    console.log("Hashed Password:", passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash, // use the hashed password
    });

    // save the user to the database
    const savedUser = await user.save();
    //console.log(savedUser);
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});


authRouter.post("/login", async function (req, res) {
  // decrpyt the password now
  // and compare it with the password in the database
  // if it matches, then send success response
  try {
    const { emailId, password } = req.body;
    // Validate emailId and password
    if (!emailId || !password) {
      return res.status(400).send("Email and password are required");
    }

    // Find user by emailId
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("Invalid credentials: User not found");
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await user.validatePassword(password)
    if (!isMatch) {
      return res.status(401).send("Password is incorrect");
    }

    // create a JWT Token
    const token = await user.getJWT();

    //console.log("Generated Token:", token);

    // Add the token to cookies and send the response back to user

    // send a cookie with the token

    res.cookie("token", token);

    // If credentials are valid, send success response
    res.status(200).send("Login successful");
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).send("ERROR: " + error.message);
  }
});


authRouter.post("/logout", async function(req,res){
    try{
        // clear the token cookie
        res.clearCookie("token");
        res.status(200).send("Logout successful");
    }
    catch{
        res.status(400).send("Error:"+ error.message)
    }

})


module.exports = authRouter;