const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET_KEY } = require("../utils/constants");

const userAuth = async (req, res, next) => {
  // Read token from req cookies
  // Validate the token
  // Find the user

  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Token not found. Login again");
    }
    const decodedToken = await jwt.verify(token, JWT_SECRET_KEY);
    const { _id } = decodedToken;
    const userData = await User.findById(_id);
    if (!userData) {
      throw new Error("Invalid Token. User not Found.");
    }

    // Attach the userData obj to req.userData so that we can access the userData obj in req
    // Here we specifying the userData object to be attached to req object explicitly. So now to access userData in any other route we can simply access by req.userData
    req.userData = userData;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (isAdminAuthorized) {
    next();
  } else {
    res.status(401).send("Admin is UNAUTHORIZED");
  }
};

module.exports = { adminAuth, userAuth };
