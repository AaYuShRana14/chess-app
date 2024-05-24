    const express = require('express');
    const router = express.Router();
    const User = require('../Models/User');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const {z}=require('zod');
    const userSchema=z.object({
        name:z.string().min(4),
        email:z.string().email(),
        password:z.string().min(6)
    });
    require('dotenv').config();
    router.post('/',async (req,res)=>{
        const {name,email,password,avatar} = req.body;
        const data=userSchema.safeParse({name,email,password});
        if(data.success){
            try{
                const user = await User.findOne({email});
                if(user){
                    return res.status(400).json({msg:'User already exists'});
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password,salt);
                const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'});
                const newUser = new User({
                    name,
                    email,
                    password:hashedPassword,
                    avatar:avatar || 'default.jpg'
                });
                await newUser.save();
                res.json({msg:'User created successfully',token});
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