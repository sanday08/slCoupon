
const User = require("../../models/User");
const Bet = require("../../models/Bet");
const WinResult = require("../../models/WinResult");




async function placeBet(retailerId, ticketId, betPoint, seriesNo, ticketBets, DrTime, isAdvance) {
  //Verify Token
  try {
    user = await User.findById(retailerId);
    if (user.creditPoint >= betPoint) {
      let bet = await Bet.create({ retailerId, ticketId, betPoint, startPoint: user.creditPoint, userName: user.userName, name: user.name, seriesNo: parseInt(seriesNo), ticketBets, DrTime, isAdvance })
      await User.findByIdAndUpdate(retailerId, { $inc: { creditPoint: -betPoint }, lastTicketId: ticketId, lastBetAmount: betPoint })
      return bet;
    }
    return 0;
  } catch (err) {
    console.log("Error on place bet", err.message);
    return;
  }
}

async function winGamePay(retailerId, price, ticketId) {
  try {
    await User.findByIdAndUpdate(retailerId, { $inc: { creditPoint: price } });
    await Bet.findOneAndUpdate({ ticketId }, { $inc: { won: price } });
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

async function deleteBet(retailerId, ticketId) {
  const betDetail = await Bet.findOne({ ticketId });
  console.log("CancelBet Suthiye", betDetail);
  if (betDetail == null) {
    return "Ticket Not Exist ";
  }
  else if (betDetail.retailerId != retailerId) {
    return "Ticket Buyed from other Retailer";
  }
  else if (betDetail.winPositions != []) {
    return "Ticket result has been declared cannot cancel";
  }
  else if (betDetail.isAdvance == true) {
    return "Advance Ticket cannot be cancelled";
  }
  else {

    await User.findByIdAndUpdate(retailerId, { $inc: { creditPoint: betDetail.betPoint } });
    await Bet.findByIdAndDelete(betDetail._id);

    return "Ticket Cancel Sucessfull";
  }



  // await User.findByIdAndUpdate(betDetail.retailerId, { $inc: { creditPoint: betDetail.betPoint } });
}


async function getLastWinnerResults() {
  try {
    let result = await WinResult.find().sort({ createdAt: -1 }).limit(4);
    console.log("results", result);

    if (result.length == 4) {
      return {
        [result[0].seriesNo]: { "A": parseInt(result[0].A), "B": parseInt(result[0].B), "C": parseInt(result[0].C), "D": parseInt(result[0].D), "E": parseInt(result[0].E), "F": parseInt(result[0].F), "G": parseInt(result[0].G), "H": parseInt(result[0].H), "I": parseInt(result[0].I), "J": parseInt(result[0].J) },
        [result[1].seriesNo]: { "A": parseInt(result[1].A), "B": parseInt(result[1].B), "C": parseInt(result[1].C), "D": parseInt(result[1].D), "E": parseInt(result[1].E), "F": parseInt(result[1].F), "G": parseInt(result[1].G), "H": parseInt(result[1].H), "I": parseInt(result[1].I), "J": parseInt(result[1].J) },
        [result[2].seriesNo]: { "A": parseInt(result[2].A), "B": parseInt(result[2].B), "C": parseInt(result[2].C), "D": parseInt(result[2].D), "E": parseInt(result[2].E), "F": parseInt(result[2].F), "G": parseInt(result[2].G), "H": parseInt(result[2].H), "I": parseInt(result[2].I), "J": parseInt(result[2].J) },
        [result[3].seriesNo]: { "A": parseInt(result[3].A), "B": parseInt(result[3].B), "C": parseInt(result[3].C), "D": parseInt(result[3].D), "E": parseInt(result[3].E), "F": parseInt(result[3].F), "G": parseInt(result[3].G), "H": parseInt(result[3].H), "I": parseInt(result[3].I), "J": parseInt(result[3].J) },
      }
    }
  } catch (err) {
    return err.message;
  }
}


async function getAdvancedBet(DrTime) {
  return await Bet.find({ isAdvance, DrTime, results: [] })

}



module.exports = { placeBet, winGamePay, updateGameResult, getLastWinnerResults, deleteBet, getAdvancedBet };