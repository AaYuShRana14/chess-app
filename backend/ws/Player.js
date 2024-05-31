const User = require('./Models/User');
const { v4: uuid } = require('uuid');
class Player{
    constructor(socket,email){
        this.id = uuid();
        this.socket = socket;
        this.email = email;
    }
    async init(){
        const user=await User.findOne({email:this.email});
        this.name=user.name;
        this.rating=user.rating;
    }
}
module.exports = Player;  