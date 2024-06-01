const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const matchSchema = new Schema({
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    loser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    verdict: {
        type: String,
        required: true
    },
    moves: {
        type: Array,
        required: true
    }
});
module.exports = mongoose.model('Match', matchSchema);