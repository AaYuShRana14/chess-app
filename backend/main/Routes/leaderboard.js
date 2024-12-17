const router= require('express').Router();
const User=require('../Models/User');
router.get('/:page',async (req,res)=>{
    try{
        const page=parseInt(req.params.page);
        const users=await User.find({},'name rating avatar totalMatches totalWins').sort({rating:-1}).limit(10).skip((page-1)*10);
        res.send(users);
    }
    catch(err){
        res.status(500).send({"error":"Internal Server Error"});
    }
});
module.exports=router;