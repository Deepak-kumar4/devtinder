const express = require('express');
const app = express();

const { adminAuth, userAuth } = require('./middlewares/auth');
const connectDB = require('./config/database');

const User = require('./models/user');

// Middleware to parse JSON bodies
app.use(express.json());

app.post("/signup", async function(req,res){
  // creating a new instance of User model
  // and saving it to the database
 const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailId: req.body.emailId,
    password: req.body.password,
    age: req.body.age,
    gender: req.body.gender

})
  try {
    const savedUser = await user.save();
    console.log(savedUser)
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send({ error: 'Error saving user' });
  }

});

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('MongoDB connected successfully');

    // Start server only after DB connection
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

