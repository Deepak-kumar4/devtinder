const mongoose = require("mongoose");
const  { Schema } = mongoose;
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema=  new mongoose.Schema({
    firstName: { 
        type: String, 
        // rquired true means you have to give it anyhow otherwise it will not give permission to insert the data 
        required: true ,
        minLength: 1,
        maxLength: 20
    },
    lastName: {
        type: String,
        minLength: 1,
        maxLength: 20,
    },
    emailId: {
        type: String,
        required: true,
        // unique true means you cannot have two users with the same emailId
        // it will throw an error if you try to insert a user with the same emailId
        unique: true,
        lowercase: true, // this will convert the emailId to lowercase before saving it
        trim: true, // this will remove any leading or trailing spaces from the emailId
        minLength: 6,
        maxLength: 50,
        validate(value){
            if(!validator.isEmail(value)) {
                // this is a custom validation function
                // it will throw an error if the emailId is not valid
                console.log("Email is not valid");
                throw new Error("Email is not valid");
            }

        }

    },
    password: { 
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                console.log("Password is not strong enough");
                throw new Error("Password is not strong enough");
            }
        },

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
        type:String,
        minLength: 10,
        maxLength: 200,
        default: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg",
        // valid if url is valid or not
        validate(value) {
            if(!validator.isURL(value)) {
                console.log("Photo URL is not valid");
                throw new Error("Photo URL is not valid");
            }
        }
    },
    about:{
        type: String,
        minLength: 10,
        maxLength: 200,
        default: "No description provided"
    },
    skills:{
        type: [String],
        default: [],
        maxLength: 10,
        validate(value) {
            if (value.length > 10) {
                throw new Error("You can only have a maximum of 10 skills");
            }
        }

    }
},
{
    timestamps: true // this will add createdAt and updatedAt fields to the schema

});

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({userId:user._id},"your_jwt_secret", { expiresIn: '7d' });
    return token;
};

userSchema.methods.validatePassword = async function(passwordInpuByUSer){
    const user = this;
    const passwordHash = user.password;
    const isMatch = await bcrypt.compare(passwordInpuByUSer, passwordHash);
    return isMatch;
}



const User = mongoose.model('User', userSchema);
module.exports = User;