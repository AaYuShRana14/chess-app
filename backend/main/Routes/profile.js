const express=require('express');
const router=express.Router();
const User=require('../Models/User');
const isLoggedin=require('../Middleware/isLoggedin');
router.get('/me',isLoggedin,async (req,res)=>{
    try{
        const user=await User.findById(req.user.id);
        res.json(user);
    }
    catch(err){
        res.status(500).send('error');

    }
});
router.get('/:id',async (req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({msg:'User not found'});
        }
        res.json(user);
    }
    catch(err){
        res.status(500).send('error');
    }
});
module.exports=router;