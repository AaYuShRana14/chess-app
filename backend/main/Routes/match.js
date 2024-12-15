const router= require('express').Router();
const Match=require('../Models/Match');
router.get('/:matchid',async (req,res)=>{
    try{
        const matchid=req.params.matchid;
        const match=await Match.findById(matchid);
        if(!match){
            return res.status(404).send({"error":"Match not found"});
        }
        await match.populate([{path:'black',select:'name avatar'},{path:'white',select:'name avatar'}]);
        res.send(match);
    }
    catch(err){
        console.error("Error fetching match:",err);
        res.status(500).send({"error":"Internal Server Error"});
    }   
});
module.exports=router;
