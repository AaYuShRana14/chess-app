const {OAuth2Client} = require('google-auth-library');
const express=require('express');
const router=express.Router();
router.post('/',async(req,res)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Referrer-Policy','no-referrer');
    const redirectUrl='https://chess-app-opin.onrender.com/oauth';
    const oAuth2Client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET,redirectUrl);
    const authorzedUrl=oAuth2Client.generateAuthUrl({
        access_type:'offline',
        scope:['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'],
        prompt:'consent'
    });
    res.json({url:authorzedUrl});
});
module.exports=router;
