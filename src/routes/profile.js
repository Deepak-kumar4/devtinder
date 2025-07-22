const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const profileRouter = express.Router();

// userAuth middleware is used to protect routes that require authentication
// It checks if the user is authenticated before allowing access to the route

profileRouter.get("/profile/view", userAuth, async function (req, res) {
  try {
    // req.user is set by the userAuth middleware
    const user = req.user;
    if (!user) {
      return res.status(404).send("User not found");
    }
    // Send the user profile data
    res.status(200).send(user); 

  } catch (error) {
    console.error("Profile error:", error);
    res.status(400).send("ERROR: " + error.message);
  }

});

profileRouter.patch("/profile/edit",userAuth,async function(req,res){
    try{
        if(!validateEditProfileData(req)){
            return res.status(400).send("Invalid profile data");
        } // Assuming you have a function to validate edit data
        const loggedInUser = req.user; // req.user is set by the userAuth middleware
        if (!loggedInUser) {
            return res.status(404).send("User not found");
        }
        // Update the user profile with the new data
        // Assuming req.body contains the fields to update
        Object.keys(req.body).forEach(key => {
            if (key !== "password") { // Assuming you don't want to allow password changes here
                loggedInUser[key] = req.body[key]; // Update the user profile with the new data
            }
        }
        );

        // Save the updated user profile
        await loggedInUser.save(); 
        // Log the updated user profile
        console.log("Logged in user:", loggedInUser);  
        res.status(200).send("Profile updated successfully");
    }
    catch(error){
        console.error("Profile edit error:", error);
        res.status(400).send("ERROR: " + error.message);
    }

})

profileRouter.patch("/profile/password", userAuth, async function (req, res) {
  try {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(404).send("User not found");
    }

    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).send("New password is required");
    }

    // Validate password strength
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).send("New password is not strong enough");
    }

    // Check if new password is same as old one
    const isSame = await bcrypt.compare(newPassword, loggedInUser.password);
    if (isSame) {
      return res.status(400).send("New password cannot be the same as the old password");
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res.send(loggedInUser);

    res.status(200).send("Password updated successfully");
  } catch (error) {
    console.error("Password update error:", error);
    res.status(400).send("ERROR: " + error.message);
  }
});









module.exports = profileRouter;