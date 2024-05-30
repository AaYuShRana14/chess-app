const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {z}=require('zod');
const userSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6)
});
require('dotenv').config();
router.post('/',async (req,res)=>{
    const {email,password} = req.body;
    const data=userSchema.safeParse({email,password});
    if(data.success){
        try{
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({msg:'Invalid credentials'});
            }
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({msg:'Invalid credentials'});
            }
            const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'});
            res.json({msg:'Login successful',token});
        }
        catch(err){
            console.error(err);
            res.status(500).send('error');
        }
    }
    else{
        res.status(400).json({msg:'Invalid data'});
    }
});
module.exports=router;