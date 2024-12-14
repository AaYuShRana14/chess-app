const User=require('../main/Models/User');
const mongoose=require('mongoose');
require('dotenv').config();
const DATABASE_URL=process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
let users=[];
for(let i=0;i<30;i++){
    const randomRating = Math.floor(Math.random() * 1000) + 500;
    const user=new User({
        name: `Demo User ${i + 1}`,
        email: `demo${i + 1}@example.com`,
        handlename: `DemoHandle${i + 1}`,
        password: "$2a$10$DemoPasswordHash12345",
        avatar: "https://www.google.com/search?q=demo+user+image&rlz=1C5CHFA_enIN1113IN1113&oq=demo+user&gs_lcrp=EgZjaHJvbWUqBwgBEAAYgAQyCQgAEEUYORiABDIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCDQxODhqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8#vhid=avozoWXIz-LycM&vssid=_GhldZ5f0BsqP4-EPmd208QQ_73", 
        rating: randomRating,
        totalMatches: 0,
        totalWins: 0,
        totalLosses: 0,
        matches: [],
        date: new Date(),
        __v: 0,
    });
    users.push(user);
}
// console.log(users);

async function seed(){
try{
    const res=await User.insertMany(users);
    console.log('30 users seeded');
}
catch(err){
    console.log(err);
}  
}
seed(); 
