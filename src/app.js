const express = require("express");
const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");

const User = require("./models/user");

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Welcome to DevTinder API");
});

app.post("/signup", async function (req, res) {
  // creating a new instance of User model
  // and saving it to the database
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailId: req.body.emailId,
    password: req.body.password,
    age: req.body.age,
    gender: req.body.gender,
  });
  try {
    const savedUser = await user.save();
    console.log(savedUser);
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send({ error: "Error saving user" });
  }
});

// this will find the user by emailId
app.get("/user",async function(req,res){
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    console.log(user); 
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: "Error fetching user" });
  }
});

// this will delete the user 
app.delete("/user", async function (req, res) {
  const userId = req.body.userId;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    console.log(deletedUser);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error deleting user" });
  }
});

// this will update the user
// you can update any field in the user model

app.patch("/user", async function (req, res) {
  const userId = req.body.userId;
  const updateData = req.body.updateData;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    console.log(updatedUser);
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(400).send({ error: "Error updating user" });
  } 
});

// this will update the user by  emailId
app.patch("/user", async function(req,res){
  const userEmail=req.body.emailId;
  const updateData=req.body.updateData;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { emailId: userEmail },
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    console.log(updatedUser);
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(400).send({ error: "Error updating user" });
  } 

})




// this is Feed api to get all the users
app.get("/feed", async function (req, res) {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).send({ message: "No users found" });
    } else {
      console.log(users);
      res.status(200).send(users);
    }
  } catch (error) {
    res.status(500).send({ error: "Error fetching users" });
  }
});

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");

    // Start server only after DB connection
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
