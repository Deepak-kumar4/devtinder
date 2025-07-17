const mongoose = require("mongoose");
const  { Schema } = mongoose;

const userSchema=  new mongoose.Schema({
    firstName: { 
        type: String, 
        // rquired true means you have to give it anyhow otherwise it will not give permission to insert the data 
        required: true ,
        minLength: 6,
        maxLength: 20
    },
    lastName: {
        type: String,
        minLength: 6,
        maxLength: 20,
    },
    emailId: {
        type: String,
        required: true,
        // unique true means you cannot have two users with the same emailId
        // it will throw an error if you try to insert a user with the same emailId
        unique: true,
        lowercase: true, // this will convert the emailId to lowercase before saving it
        trim: true // this will remove any leading or trailing spaces from the emailId

    },
    password: { 
        type: String,
        required: true,
        // this is a custom validation function
        validate(value) {
            if(value.length < 6) {
                throw new Error("Password must be at least 6 characters long");
            }
            if(value.length > 20) {
                throw new Error("Password must be at most 20 characters long");
            }
        }

    },
    age: {
        type: Number,
        min: 18,
        max: 100
    },
    gender: {
        type: String,
        // this is custom valiation function
        validate(value) {
            if(["male","female","other"].indexOf(value) === -1) {
                throw new Error("Gender data is not valid");
            }   

    },
},
    photoUrl:{
        type:String
        // default value is given so that if you don't provide a photoUrl it will take this value
        ,
        default: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"
    },
    about:{
        type: String,
        default: "No description provided"
    },
    skills:{
        type: [String],
        default: []
    }


},
{
    timestamps: true // this will add createdAt and updatedAt fields to the schema
    
});



const User = mongoose.model('User', userSchema);
module.exports = User;