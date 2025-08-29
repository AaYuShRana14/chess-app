const axios = require("axios");
const updateStatus = async (
  whiteid,
  blackid,
  winnerid,
  verdict,
  moves,
  passkey
) => {
  console.log(whiteid, blackid, winnerid, verdict, moves, passkey);
  try {
    const response = await axios.put(`${process.env.SERVER_URL}/game/update`, {
      whiteid,
      blackid,
      winnerid,
      verdict,
      moves,
      passkey,
    });
  } catch (error) {
    console.error("Error making request");
  }
};

module.exports = updateStatus;
