const jwt=require('jsonwebtoken');
require('dotenv').config();
const jwtsecret=process.env.JWT_SECRET;
module.exports=isLoggedin=(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1];
    if(token===undefined){
        return res.status(401).json({error:"Unauthorized"});
    }
    jwt.verify(token,jwtsecret,(err,user)=>{
        if(err){
            return res.status(401).json({error:"Unauthorized"});
        }
        req.user=user;
        next();
    });
};

