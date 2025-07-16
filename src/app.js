const express= require('express');
const app = express(); 
const {adminAuth,userAuth} = require('./middlewares/auth');


// Handle Auth Middleware for GET,POST, PUT, DELETE requests
// this middleware will be called for all requests using /admin path
app.use("/admin", adminAuth);


app.get("/admin/getAllData",function(req,res){
  res.send("Get all data successfully");
  // logic of checking if the request is autorized
})

// this will call the userAuth middleware

app.post("/user/data", userAuth, function(req,res){
  res.send("User data posted successfully");
  // logic of posting user data
});

// this will not call the userAuth middleware bcz it is not required for this route
app.post("/user/login",function(req,res){
  res.send("User logged in successfully");
  // logic of user login
});

app.get("/admin/deleteUser",function(req,res){
  // logic of getting all data
  res.send("Delete user successfully");
})

app.get("/user",function(req,res){
  res.send("Get user data successfully");
  // logic of getting user data
} );

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}
);

