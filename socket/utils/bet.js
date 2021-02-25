
const User = require("../../models/User");
const Bet= require("../../models/Bet");

async function placeBet(retailerId,ticketId,betPoint,SeriesNo,ticketBets) {
  //Verify Token
  try {
    bet = await Bet.create({retailerId,ticketId,betPoint,SeriesNo,ticketBets})
    await User.findByIdAndUpdate(retailerId,{$inc:{creditPoint:-betPoint}})
    return bet;
  } catch (err) {
    return err.message;
  }
}
async function getUserInfoBytoken (tokenId) {
  let token;
  //Set token from Bearer token in header
  token = tokenId.split(" ")[1];
  //Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded Id is ",decoded)
    user = await User.findById(decoded.id);
    return user;
  } catch (err) {
    return err.message;
  }
} 
module.exports = { placeBet,getUserInfoBytoken };