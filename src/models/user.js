const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET_KEY } = require("../utils/constants");
const { isEmail, isURL, isStrongPassword } = validator;
const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 2,
      maxlength: 30,
    },
    firstName: { type: String, required: true, minLength: 3, maxLength: 50 },
    lastName: { type: String, minLength: 3, maxLength: 50 },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!isEmail(value)) {
          throw new Error(
            `Email - "${value}" is incorrect. Enter the correct email.`
          );
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!isStrongPassword(value)) {
          throw new Error(
            value + " Seem like its easy password, Enter the strong password"
          );
        }
      },
    },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "Hey there, I am new to devTinder. Let's connect...",
    },
    photoUrl: {
      type: String,
      default: "geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!isURL(value)) {
          throw new Error(`${value} is not the correct url`);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

// Here always use the basic function do not use arrow functions here because this keyword does not works in arrow function
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashPassword = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashPassword
  );
  return isPasswordValid;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
