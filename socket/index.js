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
  1:{},2:{},3:{},4:{}
}
const liveRooms={};

const adminBalance={ 1:0,2:0,3:0,4:0}

io.on("connection", socket => {
  console.log("Yor Socket Id is:,",socket.id);
    console.log("SocketConnected");



    //Join Event When Application is Start
    socket.on("join", async ({ token }) => {    

      console.log("Socket join call");
        let user = await getUserInfoBytoken(token);
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
     
      console.log("**********",position);

      adminBalance[series]= adminBalance[series]+(totalBetPoint*10/100)
      //Set user position to our functions      
      for (alfa of Object.keys(position)) {
        if(allBet[series][alfa])
        {
          for(number of Object.keys(position[alfa]))        
            allBet[series][alfa]=immutable.update(allBet[series][alfa],[number],r=>r?r+position[alfa][number]:position[alfa][number])        
        }
        else 
          allBet[series]=immutable.set(allBet[series],alfa,position[alfa]);  
        }
      console.log("This is ",allBet,"******",JSON.stringify(adminBalance));
      

     bet={[retailerId]:{[series]:[position]}}
     // console.log("############",bet);

    });
  




    //Disconnect the users
    socket.on("disconnect", () => {
    });
  });
  setInterval(() => {
   
  }, 1000);

