const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    handlename:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        default: 1000
    },
    totalMatches: {
        type: Number,
        default: 0
    },
    totalWins: {
        type: Number,
        default: 0
    },
    totalLosses: {
        type: Number,
        default: 0
    },
    matches: {
        type:Schema.Types.ObjectId,
        ref:'Match'
    }
});
const User = mongoose.model('User', userSchema);
module.exports = User;