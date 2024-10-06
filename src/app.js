const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const Admin = require("./models/admin");
const Post = require("./models/posts");
const bcrypt = require("bcrypt");
const { JWT_SECRET_KEY } = require("./utils/constants");
const { vaidateSignUpData } = require("./Validators/validation");
const { userAuth } = require("./middlewares/Auth");
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

// signup user API
app.post("/signup", async (req, res) => {
  try {
    // Validate the req body
    vaidateSignUpData(req);
    const { firstName, lastName, emailId, userId, password } = req.body;
    // Password hashing
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);
    const user = new User({
      userId,
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
    console.log(passwordHash);
  } catch (error) {
    res.status(400).send(`**USER SIGNUP FAILED** ERROR : ${error.message}`);
  }
});

// Login API
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const isUserFound = await User.findOne({ emailId: emailId });
    if (!isUserFound) {
      // throw new Error("Email not registered. Sign up first");
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await isUserFound.validatePassword(password);
    if (isPasswordValid) {
      // Create the JWT
      const token = await isUserFound.getJWT();
      // Add the token to Cookie and send response to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      }); // cookie expires in 8 hours
      res.send("User login successful");
    } else {
      // res.status(400).send("Password does not match");
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.send("Error loging the user ERROR -" + err.message);
  }
});

// profile get API
app.get("/profile", userAuth, async (req, res) => {
  try {
    // console.log(req);
    const user = req.userData;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.post("/sendConnectionReq", userAuth, async (req, res) => {
  try {
    const userData = req.userData;
    const { firstName, lastName } = userData;
    res.send(firstName + " " + lastName + " is sending Connection request");
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

// find by email API Search user by its emailId from DB
app.get("/search", async (req, res) => {
  try {
    const email = req.body.emailId;
    const userData = await User.find({ emailId: email });
    if (userData.length === 0) {
      res.status(404).send("User not found");
    } else {
      // console.log(userData);
      res.send(userData);
    }
  } catch (error) {
    console.log(
      "Something went wrong (might be error occured while finding user from server)"
    );
  }
});

app.get("/searchByName", async (req, res) => {
  try {
    const userName = req.body.userName;
    const userNameArr = userName.split(" ");
    const [firstName, lastName] = userNameArr;
    const users = await User.find({ firstName: firstName, lastName: lastName });
    if (users.length === 0) {
      res
        .status(404)
        .send(
          "User doesn't found with the string. Try searching as FIRSTNAME & LASTNAME"
        );
    } else {
      res.send(users);
    }
  } catch (error) {
    console.log("Server side error while searching");
  }
});

// GET All user from DB
app.get("/feed", async (req, res) => {
  try {
    const data = await User.find({});
    res.send(data);
  } catch (error) {
    console.log("Something get wrong while fetching data from server");
  }
});

// Delete the User by its _id
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted successfully");
  } catch (error) {
    console.log("Server side error while deleting the user : ", error);
  }
});

// Update user data
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATE = [
      "userId",
      "age",
      "skills",
      "photoUrl",
      "password",
      "about",
      "gender",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATE.includes(k)
    );
    const skillsCount = data?.skills?.length;

    if (!isUpdateAllowed) {
      throw new Error(
        "Update not allowed as changing either emailID, firstName, lastName"
      );
    }
    if (skillsCount > 10) {
      throw new Error("Skills cannot exceeds 10. Max 10 Skills to be inserted");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User data updated successfully");
  } catch (error) {
    res.status(400).send(`UPDATE FAILED : Error => ${error.message}`);
  }
});

connectDB()
  .then(() => {
    console.log("Successfully connected to DB");
    app.listen(PORT, () => {
      console.log("Server running on PORT:", PORT);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to DB");
    console.log("Error => ", err);
  });
