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
app.listen(3000,()=>{
    console.log('Server started on http://localhost:3000');
});