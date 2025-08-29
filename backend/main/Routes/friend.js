const express = require('express');
const router = express.Router();
const Friend = require('../Models/Friend');
const isLoggedin = require("../Middleware/isLoggedin");
router.post('/request', isLoggedin,async (req, res) => {
    const { receiverId } = req.body;
    try {
        if (req.user.id === receiverId) {
            return res.status(200).json({ msg: "You cannot send a friend request to yourself." });
        }
        const existingRequest = await Friend.findOne({
            sender: req.user.id,
            receiver: receiverId,
            status: 'pending'
        });
        if (existingRequest) {
            return res.status(200).json({ msg: "Friend request already sent." });
        }
        const newRequest = new Friend({
            sender: req.user.id,
            receiver: receiverId
        });
        await newRequest.save();
        res.status(200).json({ msg: "Friend request sent." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error." });
    }
});
router.get('/requests/sent/:id', isLoggedin, async (req, res) => {
    const { id } = req.params;
    try {
        let sentRequest = await Friend.find({
            sender: req.user.id,
            receiver: id,
        });
        sentRequest = sentRequest[0];
        if (!sentRequest) {
            return res.status(200).json({ status: 'none' });
        }
        if( sentRequest.status === 'accepted') {
            return res.status(200).json({status: 'accepted'});
        }
        return res.status(200).json({status:'pending' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error." });
    }
});
module.exports = router;