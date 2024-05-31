const express=require('express');
const router=express.Router();
const User=require('../Models/User');
const {z}=require('zod');
const isLoggedin=require('../Middleware/isLoggedin');
const updateProfileSchema=z.object({
    handlename:z.string().min(4),
    avatar:z.string(),
});
router.put('/',isLoggedin,async (req,res)=>{
    const{handlename,avatar}=req.body;
    const data=updateProfileSchema.safeParse({avatar,handlename});
    if(data.success){
        const user=await User.findOne({email:req.user.email});
        if(!user){
            return res.status(400).json({msg:'Invalid credentials'});
        }
            user.avatar=avatar;
            user.handlename=handlename;
            await user.save();
            res.json({msg:'Profile updated successfully'});
        }
        else{
            res.status(400).json({msg:'Invalid credentials'});
        }
    });

    module.exports=router;