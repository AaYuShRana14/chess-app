const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
router.get("/", async (req, res) => {
  const code = req.query.code;
  try {
    const redirectURL = "https://chess-app-opin.onrender.com/oauth";
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectURL
    );
    const r = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(r.tokens);
    const user = oAuth2Client.credentials;
    const access_token = oAuth2Client.credentials.access_token;
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );
    const data = await response.json();
    const { email, name, picture } = data;

    try {
      const u = await User.findOne({ email: email });
      if (u) {
        const id = u._id;
        const token = jwt.sign({ email: email, id }, process.env.JWT_SECRET);
        const homepageUrl =
          "https://chess-app-two.vercel.app/"+ "/auth-redirect/?token=" + token;
        return res.redirect(homepageUrl);
      } else {
        const user = new User({
          name,
          email,
          avatar: picture,
          handlename: name,
        });
        await user.save();
        const id = user._id;
        const token = jwt.sign({ email: email, id }, process.env.JWT_SECRET);
        const homepageUrl =
          "https://chess-app-two.vercel.app/" + "/auth-redirect/?token=" + token;
        res.redirect(homepageUrl);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  } catch (err) {
    console.log("Error logging in with OAuth2 user", err);
  }
});
module.exports = router;
