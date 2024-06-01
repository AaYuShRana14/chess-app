require('dotenv').config();
const jwt=require('jsonwebtoken');
const jwtsecret=process.env.JWT_SECRET;
const Auth = (token) => {
    if(!token){
        return;
    }
    try{
        const user=jwt.verify(token,jwtsecret);
        console.log(user);
        return user;    
    }
    catch(err){
        return;
    }
}
module.exports = Auth;


