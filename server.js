const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const fileUpload = require("express-fileupload");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const immutable=require("object-path-immutable"); 



// const obj = {
//   a: {
//     b: 4
//   }
// }

// let newObj = immutable.update(obj.a, [ 'b'], v => v + 1)
//  newObj.a = immutable.update(newObj, [ 'c'], v => v + obj.a.b)
// console.log(newObj)
// const userId="70001";
const series=1;
const position2={"A":{"00":4,"11":1,'22':12,'26':12},"B":{"00":1,"11":1,"20":12},"c":{"00":1,"11":1}};
const position={"A":{"00":1,"11":3},"B":{"00":1,"11":1}};
const allBet={
  1:{},2:{},3:{},4:{}
}
for (alfa of Object.keys(position)) {
if(allBet[series][alfa])
{
  for(number of  Object.keys(position[alfa]))
    allBet[series][alfa]=immutable.update(allBet[series][alfa],number,n=>n?n+position[alfa][number]:position[alfa][number])
}
else 
 allBet[series]=immutable.set(allBet[series],alfa,position[alfa]);

}

console.log("#############",allBet)
for (alfa of Object.keys(position2)) {
  if(allBet[series][alfa])
  {
    for(number of Object.keys(position2[alfa]))
   // if(allBet[series][alfa][number])
      //allBet[series][alfa][number]=allBet[series][alfa][number]+position2[alfa][number]
      allBet[series][alfa]=immutable.update(allBet[series][alfa],[number],r=>r?r+position2[alfa][number]:position2[alfa][number])
  //  else
     // allBet[series][alfa]=immutable.set(allBet[series][alfa],number,position2[alfa][number])
  }
  else 
   allBet[series]=immutable.set(allBet[series],alfa,position2[alfa]);  
  }
console.log("This is ",allBet);


//Load env vars
dotenv.config({ path: "./config/config.env" });

//Database connections
connectDB();
//Routes files
const auth = require("./routes/auth");
const users = require("./routes/users");
const superDistributers=require("./routes/superDistributers");
const distributers=require("./routes/distributers");
const cors = require("cors");
const app = express();


//Use for Socket.io
const server = http.createServer(app);
const io = socketio(server);


//file upload middleware allways add first
app.use(fileUpload());

//Body parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// To handle SQL injection
app.use(mongoSanitize());

//set security headers(It will add bunch of value at header so Help to secure cross site attacks)
app.use(helmet());

//Prevent xss(Cross site Scripting) attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

//Prevent http param pollution (brute-forcing)
app.use(hpp());

//Enable cors (diffrent domain frontend can access api)
app.use(cors());

//Set Static folder
app.use(express.static(path.join(__dirname, "public")));


//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Mount routers
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/superDistributers",superDistributers);
app.use("/api/distributers",distributers);


//custome error handling from express error handler (Always write below the Mount Routes)
app.use(errorHandler);

const Port = process.env.PORT || 5000;
const serverException = server.listen(
  Port,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port  ${Port}`.yellow
      .bold
  )
);

//Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err.message}`.red);
  //Close server and exit process
  serverException.close(() => process.exit(1));
});

module.exports = { io };
require("./socket/index");  