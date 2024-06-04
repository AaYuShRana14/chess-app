const axios = require('axios');

const updateStatus = async (whiteid,blackid,winnerid,verdict,moves,passkey) => {
  try {
    const response = await axios.put('http://localhost:8000/game/update', {
        whiteid,
        blackid,
        winnerid,
        verdict,
        moves,
        passkey
    });
  } catch (error) {
    console.error('Error making request');
  }
};

module.exports = updateStatus;
