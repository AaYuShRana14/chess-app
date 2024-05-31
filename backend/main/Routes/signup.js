    const express = require('express');
    const router = express.Router();
    const User = require('../Models/User');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const {z}=require('zod');
    const userSchema=z.object({
        name:z.string(),
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
                const newUser = new User({
                    name,
                    email,
                    password:hashedPassword,
                    avatar: avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLsbDRAHDZCUxgdFHSARF96NvKPWCboAe7-Q&s',
                    handlename: name
                });
                await newUser.save();
                const id=newUser._id;
                const token = jwt.sign({email,id},process.env.JWT_SECRET,{expiresIn:'7d'});
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