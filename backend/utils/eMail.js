require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

const sendMail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to,
            subject,
            html,
        };
        await transporter.sendMail(mailOptions);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = sendMail;