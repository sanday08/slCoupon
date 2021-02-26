
const User = require("../../models/User");
const Bet = require("../../models/Bet");
const WinResult = require("../../models/WinResult");
async function placeBet(retailerId, ticketId, betPoint, seriesNo, ticketBets) {
  //Verify Token
  try {
    bet = await Bet.create({ retailerId, ticketId, betPoint, seriesNo: parseInt(seriesNo), ticketBets })
    await User.findByIdAndUpdate(retailerId, { $inc: { creditPoint: -betPoint } })
    return bet;
  } catch (err) {
    console.log("Error on place bet", err.message);
    return err.message;
  }
}

async function winGamePay(retailerId, price, ticketId) {
  try {
    await User.findByIdAndUpdate(retailerId, { $inc: { creditPoint: +price } });
    await Bet.findOneAndUpdate({ ticketId }, { $inc: { won: +price } });
  } catch (err) {
    return err.message;
  }
}

async function updateGameResult(series, betResult) {
  try {
    await WinResult.create({ seriesNo: parseInt(series), A: betResult[0], B: betResult[1], C: betResult[2], D: betResult[3], E: betResult[4], F: betResult[5], G: betResult[6], H: betResult[7], I: betResult[8], J: betResult[9] })
    await Bet.updateMany({ $and: [{ seriesNo: parseInt(series) }, { winPositions: [] }] }, { winPositions: betResult })
  } catch (err) {
    return err.message;
  }
}


module.exports = { placeBet, winGamePay, updateGameResult };