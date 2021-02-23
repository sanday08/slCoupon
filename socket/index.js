const _ = require("lodash");
const uniqid = require("uniqid");
const { io } = require("../server");
const {getUserInfoBytoken} = require("./utils/users");
const { customAlphabet } =require( 'nanoid')
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
const immutable=require("object-path-immutable"); 
const userBet ={
  retailerID:{1:{A:{10:2,5:4}},2:{A:{10:2,5:4}},3:{A:{10:2,5:4}},4:{A:{10:2,5:4}}}
}
const allBet={
  1:{A:{10:2,5:4}},2:{A:{10:2,5:4}},3:{A:{10:2,5:4}},4:{A:{10:2,5:4}}
}
const liveRooms={};

let totalBet=0;
let dailyTotalBet=0;
let remainingBetPoint=0;

const roundBet={
  Series:{A:{num:2}}
}

io.on("connection", socket => {
  console.log("Yor Socket Id is:,",socket.id);
    console.log("SocketConnected");



    //Join Event When Application is Start
    socket.on("join", async ({ token }) => {    

      console.log("Socket join call");
        const user = await getUserInfoBytoken(token);
        socket.emit("res", {
          data: { user,currentTime: new Date().getTime().toString()},
          en: "join",
          status: 1,
        });
    });
  
    // To: Sandip -------------------------------------
    // {"userId":"70001","series":1,"position":{"A":{"00":"1","11":"1"},"B":{"00":"1","11":"1"}},"totalBetPoint":8}
    socket.on("placeBet", async ({ retailerId, series, position,totalBetPoint }) => {
      console.log("Pila ye call karu..")
      totalBet+=totalBetPoint;
      dailyTotalBet+=totalBetPoint;
      remainingBetPoint+=totalBetPoint;
      console.log("**********",position);
      //Set user position to our functions

      for (alpha in position) {
        if(allBet.series)
        {
        
        }
        else
        {
          allBet[series]
        }
      }



     bet={[retailerId]:{[series]:[position]}}
      console.log("############",bet);

    });
  




    //Disconnect the users
    socket.on("disconnect", () => {
    });
  });
  setInterval(() => {
   
  }, 1000);

