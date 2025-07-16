const mongoose = require("mongoose");
const  { Schema } = mongoose;

const userSchema=  new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum
        : ['Male' , 'Female', 'Other'],
        required: true
    },

});


const User = mongoose.model('User', userSchema);
module.exports = User;