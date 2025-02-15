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
<<<<<<< HEAD
    const response = await axios.put('http://localhost:8000/game/update', {
        whiteid,
        blackid,
        winnerid,
        verdict,
        moves,
        passkey
=======
    const response = await axios.put("http://localhost:8000/game/update", {
      whiteid,
      blackid,
      winnerid,
      verdict,
      moves,
      passkey,
>>>>>>> a2e275a918fd78965a0329b586bc2215685efcdb
    });
  } catch (error) {
    console.error("Error making request");
  }
};

module.exports = updateStatus;
