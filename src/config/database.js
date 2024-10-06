const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/devTinder");

  //   await mongoose.connect(
  //     "mongodb+srv://rushikeshWani11:rushi2004@cluster0.xwd5v.mongodb.net/devTinder"
  //   );
};

module.exports = { connectDB };
