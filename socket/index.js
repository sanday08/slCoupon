const _ = require("lodash");
const uniqid = require("uniqid");
const { io } = require("../server");

const liveRooms={}

io.on("connection", (socket) => {
    console.log("Socketconnected");
    socket.on("join", async ({ token }) => {
      try {
        const user = await getUserInfo(token);
  
        //Check the all room one by one that room have any space?
        if (Object.keys(liveRooms).length > 0) {
          console.log(liveRooms);
          Object.keys(liveRooms).forEach((room) => {
            console.log(Object.keys(liveRooms[room]));
            //  usersRoom[user.id]={socketId}
            if (Object.keys(liveRooms[room].users).length < 5) {
              socket.join(room);
              console.log("same table user:", liveRooms);
  
              pendingRooms[socket.id] = {
                userId: user._id,
                roomId: room,
              };
              liveRooms[room].remainingTime =
                (liveRooms[room].startTime + 30 * 1000 - new Date().getTime()) /
                1000;
              liveRooms[room].users[user._id] = {
                name: user.name,
                balance: user.amount,
                avtarId: user.avtarId,
                roomId: room,
              };
              console.log("add thayo", JSON.stringify(liveRooms));
              io.in(room).emit("res", {
                data: liveRooms[room],
                en: "join",
                status: 1,
              });
            } else {
              const room = uniqid();
              // const startTime = setInterval(function () {}, 30000);
              socket.join(room);
              pendingRooms[socket.id] = {
                userId: user._id,
                roomId: room,
              };
              liveRooms = {
                [room]: {
                  users: {
                    [user._id]: {
                      name: user.name,
                      balance: user.amount,
                      avtarId: user.avtarId,
                      roomId: room,
                      userTime: new Date().getTime(),
                      //startTime,
                    },
                  },
                  lastFive: [21, 17, 8, 34, 2],
                  // startTime,
                  startTime: new Date().getTime(),
                  remainingTime: 30,
                },
              };
              console.log("new add thayo", JSON.stringify(liveRooms));
              io.in(room).emit("res", {
                data: liveRooms[room],
                en: "join",
                status: 1,
              });
            }
          });
        } else {
          const room = uniqid();
          // const startTime = setInterval(function () {}, 30000);
          socket.join(room);
          pendingRooms[socket.id] = {
            userId: user._id,
            roomId: room,
          };
          liveRooms = {
            [room]: {
              users: {
                [user._id]: {
                  name: user.name,
                  balance: user.amount,
                  avtarId: user.avtarId,
                  roomId: room,
                  //startTime,
                  userTime: new Date().getTime(),
                },
              },
              //startTime,
              lastFive: [21, 17, 8, 34, 2],
              startTime: new Date().getTime(),
              remainingTime: 30,
            },
          };
          console.log("new add thayo", JSON.stringify(liveRooms));
          io.in(room).emit("res", {
            data: liveRooms[room],
            en: "join",
            status: 1,
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    });
  

    socket.on("placeBet", async ({ userId, betAmount, position, roomId }) => {
      console.log("bet nakhi bhaiye", betAmount, position);
      const totalAmount = await placeBet(userId, betAmount);
      socket.broadcast.to(roomId).emit("res", {
        data: { userId, betAmount, position, totalAmount },
        en: "placeBet",
        status: 1,
      });
    });
  
    //Undo bet on Casino table
   
  
    //Win the bet
    socket.on("winAmount", async ({ userId, roomId, winAmount }) => {
      if (winAmount > 0) await placeBet(userId, winAmount);
      if (winAmount != 0) await addHistory(userId, winAmount);
    });
  
    //Get Last Fives
    socket.on("getLastFive", ({ roomId }) => {
      io.in(roomId).emit("res", {
        data: { lastFive: liveRooms[roomId].lastFive },
        en: "getLastFive",
        status: 1,
      });
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
