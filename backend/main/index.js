const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const mongoose = require("mongoose");
const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/signup", require("./Routes/signup"));
app.use("/login", require("./Routes/login"));
app.use("/profile", require("./Routes/profile"));
app.use("/googleauth", require("./Routes/google"));
app.use("/oauth", require("./Routes/oauth"));
app.use("/updateProfile", require("./Routes/updateProfile"));
app.use("/forgot-password", require("./Routes/forgotPassword"));
app.use("/reset-password", require("./Routes/resetPassword"));
app.use("/game", require("./Routes/game"));
app.use("/leaderboard", require("./Routes/leaderboard"));
app.use("/history", require("./Routes/history"));
app.use("/match", require("./Routes/match"));
app.listen(8000, () => {
  console.log("Server started on https://chess-app-opin.onrender.com");
});
