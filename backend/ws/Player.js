const User = require('../models/User');
class Player{
    constructor(socket,email){
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