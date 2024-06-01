const axios = require('axios');

const updateStatus = async (winner,loser,verdict,moves,passkey) => {
  try {
    const response = await axios.put('http://localhost:8000/game/update', {
        winnerid:winner,
        loserid:loser,
        verdict,
        moves,
        passkey
    });
  } catch (error) {
    console.error('Error making request');
  }
};

module.exports = updateStatus;
