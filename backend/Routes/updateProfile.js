const express=require('express');
const router=express.Router();
const User=require('../Models/User');
const {z}=require('zod');
const isLoggedin=require('../Middleware/isLoggedin');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET=process.env.JWT_SECRET;
const updateProfileSchema=z.object({
    name:z.string().min(4),
    avatar:z.string().url(),
    password:z.string().min(6)
});
router.put('/',isLoggedin,async (req,res)=>{
    const{name,avatar,password}=req.body;
    const data=updateProfileSchema.safeParse({name,avatar,password});
    if(data.success){
        const user=await User.findOne({email:req.user.email});
            user.name=name;
            user.avatar=avatar;
            user.password=await bcrypt.hash(password,await bcrypt.genSalt(10));
            await user.save();
            const token=jwt.sign({email:user.email},JWT_SECRET,{expiresIn:'7d'});
            res.json({msg:'Profile updated successfully',token});
        }
        else{
            res.status(400).json({msg:'Invalid credentials'});
        }
    });

    module.exports=router;