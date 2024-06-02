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
        enum: ['win', 'loss', 'draw'],
        required: true
    },
    moves: {
        type: [String], 
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Match', matchSchema);
