
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



async function getLastWinnerResults() {
  try {
    let result = await WinResult.find().sort("-createdAt").limit(4);
    console.log("results", result);

    if (result.length == 4) {
      return {
        [result[0].seriesNo]: { "A": result[0].A, "B": result[0].B, "C": result[0].C, "D": result[0].D, "E": result[0].E, "F": result[0].F, "G": result[0].G, "H": result[0].H, "I": result[0].I, "J": result[0].J },
        [result[1].seriesNo]: { "A": result[1].A, "B": result[1].B, "C": result[1].C, "D": result[1].D, "E": result[1].E, "F": result[1].F, "G": result[1].G, "H": result[1].H, "I": result[1].I, "J": result[1].J },
        [result[2].seriesNo]: { "A": result[2].A, "B": result[2].B, "C": result[2].C, "D": result[2].D, "E": result[2].E, "F": result[2].F, "G": result[2].G, "H": result[2].H, "I": result[2].I, "J": result[2].J },
        [result[3].seriesNo]: { "A": result[3].A, "B": result[3].B, "C": result[3].C, "D": result[3].D, "E": result[3].E, "F": result[3].F, "G": result[3].G, "H": result[3].H, "I": result[3].I, "J": result[3].J },
      }
    }
  } catch (err) {
    return err.message;
  }
}




module.exports = { placeBet, winGamePay, updateGameResult, getLastWinnerResults };