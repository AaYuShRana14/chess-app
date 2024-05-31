const express=require('express');
const app=express();
app.use(express.json());
const cors=require('cors');
app.use(cors());
require('dotenv').config();
const mongoose=require('mongoose');
const DATABASE_URL=process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
 
app.use('/signup',require('./Routes/signup'));

app.use('/login',require('./Routes/login'));
app.use('/googleauth',require('./Routes/google'));
app.use('/oauth',require('./Routes/oauth'));
app.use('/updateProfile',require('./Routes/updateProfile'));
app.use('/forgot-password',require('./Routes/forgotPassword'));
app.use('/reset-password',require('./Routes/resetPassword'));
app.listen(8000,()=>{
    console.log('Server started on http://localhost:8000');
});