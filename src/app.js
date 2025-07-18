const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

const {userAuth} = require("./middlewares/auth");
const connectDB = require("./config/database");

const User = require("./models/user");

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

app.get("/", function (req, res) {
  res.send("Welcome to DevTinder API");
});

app.post("/login", async function (req, res) {
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

// userAuth middleware is used to protect routes that require authentication
// It checks if the user is authenticated before allowing access to the route

app.get("/profile", userAuth, async function (req, res) {
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

app.post("/signup", async function (req, res) {
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

app.post("/sendConnectionRequest", userAuth, async function (req, res) {
  // This route is for sending a connection request to another user
  try {
    const { recipientId } = req.body; // recipientId is the userId of the user to whom you want to send the connection request

    if (!recipientId) {
      return res.status(400).send("Recipient ID is required");
    }

    // Find the recipient user
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).send("Recipient not found");
    }

    // Here you can implement logic to send a connection request
    // For example, you can add the recipient's ID to the sender's list of connection requests
    const sender = req.user; // req.user is set by the userAuth middleware
    if (!sender) {
      return res.status(404).send("Sender not found");
    }
    // Assuming sender has a field called connectionRequests which is an array of userIds
    if (!sender.connectionRequests) {
      sender.connectionRequests = [];
    }
    if (sender.connectionRequests.includes(recipientId)) {
      return res.status(400).send("Connection request already sent");
    }
    sender.connectionRequests.push(recipientId);
    await sender.save(); // Save the updated sender user
    // Optionally, you can also notify the recipient about the connection request
    // For example, you can send an email or a notification
    // res.status(200).send("Connection request sent successfully");
    // For now, just send a success response
    console.log(`Connection request sent from ${sender._id} to ${recipient._id}`);
    // Send a success response

    res.status(200).send("Connection request sent successfully");
  } catch (error) {
    console.error("Connection request error:", error);
    res.status(400).send("ERROR: " + error.message);
  }
});

// // this will find the user by emailId
// app.get("/user", async function (req, res) {
//   const userEmail = req.body.emailId;
//   try {
//     const user = await User.find({ emailId: userEmail });
//     if (!user) {
//       return res.status(404).send({ message: "User not found" });
//     }
//     //console.log(user);
//     res.status(200).send(user);
//   } catch (error) {
//     res.status(500).send({ error: "Error fetching user" });
//   }
// });

// // this will delete the user
// app.delete("/user", async function (req, res) {
//   const userId = req.body.userId;
//   try {
//     const deletedUser = await User.findByIdAndDelete(userId);
//     if (!deletedUser) {
//       return res.status(404).send({ message: "User not found" });
//     }
//     //console.log(deletedUser);
//     res.status(200).send({ message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).send({ error: "Error deleting user" });
//   }
// });

// // this will update the user
// // you can update any field in the user model

// // app.patch("/user", async function (req, res) {
// //   const userId = req.body.userId;
// //   const updateData = req.body.updateData;
// //   try {
// //     const updatedUser = await User.findByIdAndUpdate(
// //       userId,
// //       updateData,
// //       { new: true, runValidators: true }
// //     );
// //     if (!updatedUser) {
// //       return res.status(404).send({ message: "User not found" });
// //     }
// //     console.log(updatedUser);
// //     res.status(200).send(updatedUser);
// //   } catch (error) {
// //     res.status(400).send({ error: "Error updating user" });
// //   }
// // });

// // this will update the user by  emailId
// app.patch("/user/:userId", async function (req, res) {
//   // ? this will insure that if userId is not provided in the request params, it will not throw an error
//   const userId = req.params?.userId;
//   const updateData = req.body;

//   try {
//     const ALLOWED_UPDATES = [
//       "firstName",
//       "lastName",
//       "gender",
//       "password",
//       "age",
//       "photoUrl",
//       "about",
//       "skills",
//     ];

//     // Only validate keys that are part of the updateData
//     const keys = Object.keys(updateData);
//     const isValidOperation = keys.every((key) => ALLOWED_UPDATES.includes(key));

//     if (!isValidOperation) {
//       return res.status(400).send({ error: "Invalid update fields!" });
//     }

//     const user = await User.findByIdAndUpdate(userId, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!user) {
//       return res.status(404).send({ message: "User not found" });
//     }

//    // console.log("Updated user:", user);
//     res.status(200).send(user);
//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(400).send({ error: "Error updating user" });
//   }
// });
// // this is Feed api to get all the users
// app.get("/feed", async function (req, res) {
//   try {
//     const users = await User.find({});
//     if (users.length === 0) {
//       return res.status(404).send({ message: "No users found" });
//     } else {
//       console.log(users);
//       res.status(200).send(users);
//     }
//   } catch (error) {
//     res.status(500).send({ error: "Error fetching users" });
//   }
// });

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
