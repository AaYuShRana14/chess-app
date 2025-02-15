const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const isLoggedin = require("../Middleware/isLoggedin");

router.get("/me", isLoggedin, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      user = await User.findOne({ email: req.user.email });
    }
    res.json(user);
  } catch (err) {
    res.status(500).send("error");
  }
});

router.get("/games", isLoggedin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "matches",
      populate: [
        { path: "white", select: "name" },
        { path: "black", select: "name" },
      ],
    });

    if (!user || !user.matches) {
<<<<<<< HEAD
      console.log('no matches found');
      return res.status(404).json({ msg: 'No matches found for this user' });
=======
      return res.status(404).json({ msg: "No matches found for this user" });
>>>>>>> a2e275a918fd78965a0329b586bc2215685efcdb
    }

    const matches = user.matches
      .sort((a, b) => b.date - a.date)
      .map((match) => {
        let winner;
        if (match.verdict === "white") {
          winner = match.white.name;
        } else if (match.verdict === "black") {
          winner = match.black.name;
        } else {
          winner = "draw";
        }

        return {
          white: match.white.name,
          whiteId: match.white._id.toString(),
          black: match.black.name,
          blackId: match.black._id.toString(),
          winner: winner,
          moves: match.moves,
          date: match.date,
        };
      });
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).send("error");
  }
});

module.exports = router;
