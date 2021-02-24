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
