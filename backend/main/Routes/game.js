const express=require('express');
const router=express.Router();
const user=require('../Models/User');
require('dotenv').config();
const K_FACTOR = 32; 
const expectedScore = (ratingA, ratingB) => {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
};

const updateRating = (winnerRating, loserRating) => {
    const expectedWin = expectedScore(winnerRating, loserRating);
    const expectedLoss = expectedScore(loserRating, winnerRating);

    const updatedWinnerRating = winnerRating + K_FACTOR * (1 - expectedWin);
    const updatedLoserRating = loserRating + K_FACTOR * (0 - expectedLoss);

    return {
        winnerRating: Math.round(updatedWinnerRating),
        loserRating: Math.round(updatedLoserRating),
    };
};
router.put('/update',async(req,res)=>{
    const{winnerid,loserid,verdict,passkey,moves}=req.body;
    console.log(winnerid,loserid,verdict,passkey,moves);
    if(passkey!==process.env.PASS_KEY){
        res.status(401).send('Unauthorized');
        return;
    }
    const winner=await user.findById(winnerid);
    const loser=await user.findById(loserid);
    winner.totalMatches++;
    loser.totalMatches++;
    if(verdict==='win'){
        winner.totalWins++;
        loser.totalLosses++;
        const { winnerRating, loserRating } = updateRating(winner.rating, loser.rating);
        winner.rating = winnerRating;
        loser.rating = loserRating;
    }
    await winner.save();
    await loser.save();
    console.log('Update profile');
    res.send('Update profile');
});
module.exports=router;