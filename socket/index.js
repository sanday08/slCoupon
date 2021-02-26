const { io } = require("../server");
const { getUserInfoBytoken } = require("./utils/users");
const { placeBet, winGamePay, updateGameResult } = require("./utils/bet");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);
const immutable = require("object-path-immutable");
let userBets = {}; //retailerID:{1:{A:{10:2,5:4}},2:{A:{10:2,5:4}},3:{A:{10:2,5:4}},4:{A:{10:2,5:4}}}

let allBet = {
  1: {},
  3: {},
  5: {},
  6: {},
};
const winnerNumbers = { 1: {}, 3: {}, 5: {}, 6: {} };
let winnerNumbersArray = {}
let lastMinutes = 0;
let winnerUsers = {};
let ticketIdBase = {};
const adminBalance = { 1: 0, 3: 0, 5: 0, 6: 0 };

io.on("connection", (socket) => {
  console.log("Yor Socket Id is:,", socket.id);
  console.log("SocketConnected");

  //Join Event When Application is Start
  socket.on("join", async ({ token }) => {
    console.log("Socket join call");
    let user = await getUserInfoBytoken(token);
    socket.emit("res", {
      data: {
        user,
        currentTime: new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Calcutta",
        }),
      },
      en: "join",
      status: 1,
    });
  });

  socket.on(
    "placeBet",
    async ({ retailerId, series, position, totalBetPoint }) => {
      const ticketId = nanoid();
      placeBet(retailerId, ticketId, series, position, totalBetPoint);
      console.log("Pila ye call karu..", series);
      for (let alpha in position) {
        for (let number in position[alpha]) {
          userBets = immutable.update(
            userBets,
            [ticketId, retailerId, series, alpha, number],
            (v) => (v ? v + position[alpha][number] : position[alpha][number]),
          );
          ticketIdBase = immutable.set(
            ticketIdBase,
            [series, alpha, number, ticketId],
            position[alpha][number],
          );
          winnerUsers[ticketId] = retailerId;
          allBet = immutable.update(allBet, [series, alpha, number], (v) =>
            v ? v + position[alpha][number] : position[alpha][number],
          );
        }
      }
      adminBalance[series] =
        adminBalance[series] +
        Math.round(totalBetPoint - (totalBetPoint * 10) / 100, 2);

      socket.emit("res", {
        data: {
          ticketId,
        },
        en: "placeBet",
        status: 1,
      });

      console.log(
        "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ userBets",
        JSON.stringify(userBets),
      );
      console.log(
        "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& allBet",
        JSON.stringify(allBet),
      );
      console.log(
        "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% adminBalance",
        JSON.stringify(adminBalance),
      );
    },
  );

  //Disconnect the users
  socket.on("disconnect", () => { });
});
setInterval(async () => {
  if (new Date().getHours() > 8 && new Date().getHours() < 22) {
    if (
      new Date().getMinutes() % 2 == 0 &&
      lastMinutes != new Date().getMinutes()
    ) {
      lastMinutes = new Date().getMinutes();
      //Winner Logic
      for (let i of Object.keys(allBet)) {
        const alphaArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        shuffle(alphaArray);
        console.log(alphaArray);
        for (let [ai, alpha] of alphaArray.entries()) {
          let winnerNumber = Math.round(Math.random() * 99);
          if (allBet[i][alpha]) {
            // mene dala
            if (ai > 6) {
              const entryKeys = Object.keys(allBet[i][alpha]);
              const random = Math.floor(Math.random() * entryKeys.length);
              winnerNumber = parseInt(entryKeys[random]);
            }
            if (allBet[i][alpha][winnerNumber]) {
              let a = 0;
              while (
                allBet[i][alpha][winnerNumber] * 90 > adminBalance[i] &&
                a < 100
              ) {
                winnerNumber = Math.round(Math.random() * 99);
                a++;
              }
              console.log(
                "Mere to l lag gaye",
                allBet[i][alpha][winnerNumber] * 90,
              );
              adminBalance[i] -= allBet[i][alpha][winnerNumber] * 90;
            }
          }
          winnerNumbers[i][alpha] = winnerNumber;
        }
      }
      console.log(winnerNumbers);
      for (let i in winnerNumbers) {
        winnerNumbersArray[i] = getResultArray(winnerNumbers[i]);
        await updateGameResult(i, winnerNumbersArray[i]);
      }
      console.log("Winner Array Is ", winnerNumbersArray);
      for (let series in winnerNumbers) {
        for (let alpha in winnerNumbers[series]) {
          let number = winnerNumbers[series][alpha][number];
          for (t in ticketIdBase[series][alpha][number]) {
            let price = ticketIdBase[series][alpha][number][t] * 90;
            await winGamePay(ticketIdBase[t], price, t);
          }
        }
      }

      console.log("Admin Balance is", adminBalance);
      socket.emit("res", {
        data: {
          winnerNumbers
        },
        en: "resultUpdate",
        status: 1,
      });
    }
  }
}, 1000);

//ShuffleArray
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//Get all results in Array

function getResultArray(winResult) {
  return [winnerNumber["A"], winnerNumber["B"], winnerNumber["C"], winnerNumber["D"], winnerNumber["E"], winnerNumber["F"], winnerNumber["G"], winnerNumber["H"], winnerNumber["I"], winnerNumber["J"]]
}