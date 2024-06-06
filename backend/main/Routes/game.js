const express = require('express');
const router = express.Router();
const user = require('../Models/User');
const Match = require('../Models/Match');
require('dotenv').config();
const K_FACTOR = 32;
const expectedScore = (ratingA, ratingB) => {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
};
const updateRating = (winnerRating, loserRating, verdict) => {
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
    const { whiteid, blackid, winnerid, verdict, passkey, moves } = req.body;
    console.log(whiteid, blackid, winnerid, verdict, passkey, moves);
    if (passkey !== process.env.PASS_KEY) {
        res.status(401).send('Unauthorized');
        return;
    }
    const white = await user.findById(whiteid);
    const black = await user.findById(blackid);
    white.totalMatches++;
    black.totalMatches++;
    if (verdict === 'win') {
        if (winnerid === whiteid) {
            white.totalWins++;
            black.totalLosses++;
        }
        else {
            black.totalWins++;
            white.totalLosses++;
        }
    }
    await white.save();
    await black.save();
    let winner=null;
    let loser=null;
    if (winnerid === whiteid) {
        winner = await user.findById(whiteid);
        loser = await user.findById(blackid);
    }
    else if (winnerid === blackid) {
        winner = await user.findById(blackid);
        loser = await user.findById(whiteid);
    }
    const { winnerRating, loserRating } = updateRating(winner.rating, loser.rating, verdict);
    winner.rating = winnerRating;
    loser.rating = loserRating;
    let ver=verdict;
    if(verdict!=='draw'){
        if(winnerid===whiteid){
            ver="white";
        }
        else{
            ver="black";
        }
    }
    const match = new Match({
        white: whiteid,
        black: blackid,
        verdict:ver,
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