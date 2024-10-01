const express = require("express");

const app = express();
const PORT = 5000;
// Callback inside use method is called as request handler
app.use("/user", (req, res) => {
  res.send("Hello User, we are glad to see you here!");
});
app.use("/admin", (req, res) => {
  res.send("Hello Admin, we are glad to see you here!");
});
app.listen(PORT, () => {
  console.log("Server running on PORT:", PORT);
});
