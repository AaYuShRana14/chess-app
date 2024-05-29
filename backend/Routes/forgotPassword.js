const express=require('express');
const router=express.Router();
const User=require('../Models/User');
const sendMail=require('../utils/eMail');
const isLoggedin=require('../Middleware/isLoggedin');
const jwt=require('jsonwebtoken');
require('dotenv').config();

router.post('/', async (req,res)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user) {
        return res.status(400).json({msg:'User not found'});
    }
    const resettoken=jwt.sign({email:req.body.email},process.env.JWT_SECRET,{expiresIn:'1h'});
    const link=`http://localhost:3000/reset-password/${resettoken}`;
    const email=req.body.email;
    const subject='Password reset';
    const html=`<p>Click <a href="${link}">here</a> to reset your password</p>`;
    const isMailSent=await sendMail(email,subject,html);
    if(isMailSent){
        res.status(200).json({msg:'Password reset link sent to your email'});
    }
    else{
        res.status(500).json({msg:'Error sending email'});
    }
});
module.exports=router;
