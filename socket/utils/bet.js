
const User = require("../../models/User");
const Bet = require("../../models/Bet");
const WinResult = require("../../models/WinResult");
const Winning = require("../../models/Winning");
const WinnerId = require("../../models/WinnerId");


async function placeBet(retailerId, ticketId, betPoint, seriesNo, ticketBets, DrTime, isAdvance) {
  //Verify Token
  try {
    user = await User.findById(retailerId);
    if (user.creditPoint >= betPoint) {
      let isCount = true;
      let bet;

      const distributer = await User.findById(user.referralId);
      const superDistributer = await User.findById(distributer.referralId);

      if (isAdvance) {
        isCount = false;
        bet = await Bet.create({
          retailerId, ticketId, betPoint, startPoint: user.creditPoint, userName: user.userName, name: user.name, seriesNo: parseInt(seriesNo), ticketBets, DrTime, isAdvance, isCount,
          distributerCommission: betPoint * distributer.commissionPercentage / 100, superDistributerCommission: betPoint * superDistributer.commissionPercentage / 100,
          retailerCommission: betPoint * user.commissionPercentage / 100
        })
      }
      else
        bet = await Bet.create({
          retailerId, ticketId, betPoint, startPoint: user.creditPoint, userName: user.userName, name: user.name, seriesNo: parseInt(seriesNo), ticketBets, isAdvance,
          distributerCommission: betPoint * distributer.commissionPercentage / 100, superDistributerCommission: betPoint * superDistributer.commissionPercentage / 100,
          retailerCommission: betPoint * user.commissionPercentage / 100
        })


      await User.findByIdAndUpdate(retailerId, { $inc: { creditPoint: -betPoint, commissionPoint: betPoint * user.commissionPercentage / 100 }, lastTicketId: ticketId, lastBetAmount: betPoint })
      await User.findByIdAndUpdate(user.referralId, { $inc: { commissionPoint: betPoint * distributer.commissionPercentage / 100 } })
      await User.findByIdAndUpdate(distributer.referralId, { $inc: { commissionPoint: betPoint * superDistributer.commissionPercentage / 100 } })


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
    await Bet.updateMany({ $and: [{ seriesNo: parseInt(series) }, { winPositions: [] }, { isCount: true }] }, { winPositions: betResult })
  } catch (err) {
    return err.message;
  }
}
//Used For cancel Bet
async function deleteBet(retailerId, ticketId) {
  const betDetail = await Bet.findOne({ ticketId });
  let result = "";
  let success = false;
  if (betDetail == null) {
    result = "Ticket Not Exist ";
  }
  else if (betDetail.retailerId != retailerId) {
    result = "Ticket Buyed from other Retailer";
  }
  else if (betDetail.winPositions.length != 0) {
    result = "Ticket result has been declared cannot cancel";
  }
  else if (betDetail.isAdvance == true) {
    result = "Advance Ticket cannot be cancelled";
  }
  else {
    console.log("start 1");
    const retailer = await User.findByIdAndUpdate(retailerId, { $inc: { creditPoint: betDetail.betPoint } });
    const distributer = await User.findById(retailer.referralId);
    console.log("start 2");
    await User.findByIdAndUpdate(retailerId, { $inc: { commissionPoint: -betDetail.retailerCommission } })
    console.log("start 3");
    console.log("distributrID", retailer.referralId, distributer, "commision:", betDetail.distributterCommission);

    await User.findByIdAndUpdate(retailer.referralId, { $inc: { commissionPoint: -betDetail.distributterCommission } })
    console.log("start 4");
    await User.findByIdAndUpdate(distributer.referralId, { $inc: { commissionPoint: -betDetail.superDistributerCommission } })
    console.log("start 5");
    await Bet.findByIdAndDelete(betDetail._id);
    success = true;
    result = "Ticket Cancel Sucessfull";
  }
  if (success)
    return { success: true, series: betDetail.seriesNo, position: betDetail.ticketBets, result, betPoint: betDetail.betPoint }
  else
    return { success: false, result }

  // await User.findByIdAndUpdate(betDetail.retailerId, { $inc: { creditPoint: betDetail.betPoint } });
}


//get Last winning result number 
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

//get Advanced Bet 
async function getAdvancedBet(DrTime) {
  await Bet.updateMany({ $and: [{ isAdvance: true }, { DrTime }, { results: [] }] }, { isCount: true });
  return await Bet.find({ $and: [{ isAdvance: true }, { DrTime }, { results: [] }] })
}

//Get Admin Percentage for winning Result
async function getAdminPer() {
  return Winning.findById("602e55e9a494988def7acc25")
}

//Get user For winnerNumbers
async function getUserForWinner() {
  let user = await WinnerId.find();
  // if (user != null) {
  //   return { success: true, user: user[0].retailerId };
  // }
  // else
  return { success: false }
}

module.exports = { placeBet, winGamePay, updateGameResult, getLastWinnerResults, deleteBet, getAdvancedBet, getAdminPer, getUserForWinner };