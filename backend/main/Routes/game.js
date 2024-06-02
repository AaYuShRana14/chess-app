const express = require('express');
const router = express.Router();
const user = require('../Models/User');
const Match = require('../Models/Match');
require('dotenv').config();
const K_FACTOR = 32;
const expectedScore = (ratingA, ratingB) => {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
};
const updateRating = (winnerRating, loserRating,verdict) => {
    const expectedWin = expectedScore(winnerRating, loserRating);
    const expectedLoss = expectedScore(loserRating, winnerRating);
    let updatedWinnerRating = 0;
    let updatedLoserRating = 0;
    if (verdict === 'win') {
        updatedWinnerRating = winnerRating + K_FACTOR * (1 - expectedWin);
        updatedLoserRating = loserRating + K_FACTOR * (0 - expectedLoss);
    }
    if (verdict === 'draw') {
        updatedWinnerRating = winnerRating + K_FACTOR * (0.5 - expectedWin);
        updatedLoserRating = loserRating + K_FACTOR * (0.5 - expectedLoss);
    }
    return {
        winnerRating: Math.round(updatedWinnerRating),
        loserRating: Math.round(updatedLoserRating),
    };
};

router.put('/update', async (req, res) => {
    const { winnerid, loserid, verdict, passkey, moves } = req.body;
    if (passkey !== process.env.PASS_KEY) {
        res.status(401).send('Unauthorized');
        return;
    }
    const winner = await user.findById(winnerid);
    const loser = await user.findById(loserid);
    winner.totalMatches++;
    loser.totalMatches++;
    if (verdict === 'win') {
        winner.totalWins++;
        loser.totalLosses++;
    }
    const { winnerRating, loserRating } = updateRating(winner.rating, loser.rating, verdict);
    winner.rating = winnerRating;
    loser.rating = loserRating;
    const match=new Match({
        winner:winner._id,
        loser:loser._id,
        verdict,
        moves
    });
    winner.matches.push(match);
    loser.matches.push(match);
    await winner.save();
    await loser.save();
    await match.save();
    res.send('Update profile');
});
module.exports = router;