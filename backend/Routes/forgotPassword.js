const express=require('express');
const router=express.Router();
const User=require('../Models/User');
const sendMail=require('../utils/eMail');
const isLoggedin=require('../Middleware/isLoggedin');
const jwt=require('jsonwebtoken');
require('dotenv').config();
router.post('/',isLoggedin,async (req,res)=>{
    const resettoken=jwt.sign({email:req.user.email},process.env.JWT_SECRET,{expiresIn:'1h'});
    const link=`http://localhost:3000/resetPassword/${resettoken}`;
    const email=req.user.email;
    const subject='Password reset';
    const html=`<p>Click <a href="${link}">here</a> to reset your password</p>`;
    const isMailSent=await sendMail(email,subject,html);
    if(isMailSent){
        res.json({msg:'Password reset link sent to your email'});
    }
    else{
        res.status(500).json({msg:'Error sending email'});
    }
});
module.exports=router;
