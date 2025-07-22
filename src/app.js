const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");


// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

const authRouter = require("./routes/auth");
const requestsRouter = require("./routes/requests");
const profileRouter = require("./routes/profile");


// Use the routers
app.use("/", authRouter);
app.use("/", requestsRouter);
app.use("/", profileRouter);







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
