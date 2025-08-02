const router = require('express').Router();
const User = require('../Models/User');

router.get("/:userid", async (req, res) => {
    try {
        const userid = req.params.userid;
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        const populatedUser = await user.populate('matches');
        let matches = populatedUser.matches;

        // Sort matches by createdAt in descending order
        matches = matches.sort((a, b) => b.createdAt - a.createdAt);

        const populatedMatches = await Promise.all(
            matches.map(async (match) => {
                return match.populate([
                    { path: 'black', select: 'name' },
                    { path: 'white', select: 'name' }
                ]);
            })
        );
        res.send(populatedMatches);
    } catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

module.exports = router;
