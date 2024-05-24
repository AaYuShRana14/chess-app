const expess=require('express');
const router=expess.Router();
const User=require('../Models/User');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const {z}=require('zod');
const passwordSchema=z.object({
    password:z.string().min(6)
});
router.get('/:resettoken',async (req,res)=>{
    try{
        const user=jwt.verify(req.params.resettoken,process.env.JWT_SECRET);
        const curUser=await User.findOne({email:user.email});
        if(curUser){
            const data=passwordSchema.safeParse({password:req.body.password});
            if(!data.success){
                return res.status(400).json({msg:'Invalid data'});
            }
            const salt=await bcrypt.genSalt(10);
            const password=await bcrypt.hash(req.body.password,salt);
            curUser.password=password;
            await curUser.save();
            const token=jwt.sign({email:user.email},process.env.JWT_SECRET,{expiresIn:'7d'});
            res.json({msg:'Password reset successful',token});
        }
        else{
            res.status(400).json({msg:'Invalid token'});
        }

    }
    catch(err){
        res.status(400).json({msg:'Invalid token'});
    }
});
module.exports=router;