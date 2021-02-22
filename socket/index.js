const _ = require("lodash");
const uniqid = require("uniqid");
const { io } = require("../server");
const {getUserInfoBytoken} = require("./utils/users");
const { customAlphabet } =require( 'nanoid')
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
const bet ={
  retailerID:{series:{A:{10:2,5:4}}}
}
const liveRooms={};

const totalBet=0;
const dailyTotalBet=0;
const remainingBetPoint=0;

const roundBet={
  Series:{A:{num:2}}
}

io.on("connection", (socket) => {
    console.log("SocketConnected");
    socket.on("join", async ({ token }) => {    
        const user = await getUserInfoBytoken(token);
        socket.emit("res", {
          data: { user,currentTime: new Date().getTime()},
          en: "join",
          status: 1,
        });
    });
  

    socket.on("placeBet", async ({ retailerId, series, position,totalBetPoint }) => {
      totalBet+=totalBetPoint;
      dailyTotalBet+=totalBetPoint;
      remainingBetPoint+=totalBetPoint;
      console.log("**********",position);


     bet={[retailerId]:{[series]:[position]}}
      console.log("############",bet);

    });
  




    //Undo bet on Casino table
   
  
    //Win the bet
    socket.on("winAmount", async ({ userId, roomId, winAmount }) => {
      if (winAmount > 0) await placeBet(userId, winAmount);
      if (winAmount != 0) await addHistory(userId, winAmount);
    });
  
   //Leave the room 
    socket.on("leaveRoom", ({ userId, roomId }) => {
      console.log("Disconnect thay gyo", roomId);
      console.log("Disconnect thay gyo", userId);
  
      delete pendingRooms[socket.id];
      if (liveRooms[roomId]) {
        delete liveRooms[roomId].users[userId];
        if (Object.keys(liveRooms[roomId].users).length === 0)
          delete liveRooms[roomId];
      }
      io.in(roomId).emit("res", {
        data: userId,
        en: "disconnect",
        status: 1,
      });
    });
  
    //Disconnect the users
    socket.on("disconnect", () => {
      console.log(socket.id);
      if (pendingRooms[socket.id] != undefined) {
        const room = pendingRooms[socket.id].roomId;
        const userId = pendingRooms[socket.id].userId;
        console.log("Disconnect thay gyo", room);
        console.log("Disconnect thay gyo", userId);
  
        delete pendingRooms[socket.id];
        if (liveRooms[room]) {
          delete liveRooms[room].users[userId];
          if (Object.keys(liveRooms[room].users).length === 0)
            delete liveRooms[room];
        }
        io.in(room).emit("res", {
          data: userId,
          en: "disconnect",
          status: 1,
        });
      }
    });
  });
  setInterval(() => {
    Object.keys(liveRooms).forEach((room) => {
      console.log("Start Time", liveRooms[room].startTime);
      if (liveRooms[room].startTime + 30000 < new Date().getTime()) {
        console.log("Live Time", new Date().getTime());
        console.log("Start Time", liveRooms[room].startTime);
        let randNo = Math.floor(Math.random() * 37);
        liveRooms[room].startTime = new Date().getTime();
        console.log(randNo);
        liveRooms[room].lastFive.shift();
        liveRooms[room].lastFive.push(randNo);
        io.in(room).emit("res", {
          data: { randNo, lastFive: liveRooms[room].lastFive },
          en: "getRandomNo",
          status: 1,
        });
      }
    });
  }, 1000);

