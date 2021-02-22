const totalIncome = 5000;
const adminBalance = 4500; // 

let obj = {
    one: {
        A: {
            1: 300,
            2: 400,
            3: 500
        }
    }
}



const winnerNumbers = {} // To Store winnerNumber of all 40 room


function getWinner() {
    const winnerNumber = random(0, 99)
}

for (let i = 1; i < 5; i++) {

    const alphaArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    shuffle(alphaArray)
    for (let [ai, alpha] of alphaArray.entries()) {
        const winnerNumber = random(0, 99)
        if (ai > 6) {
            const entryKeys = Object.keys(obj[i][alpha])
            const random = Math.floor(Math.random() * entryKeys.length);
            winnerNumber = entryKeys[random]
        }
        if (obj[i][alpha][winnerNumber]) {
            let a = 0;
            while (obj[i][alpha][winnerNumber] * 90 > adminBalance && a < 100) {
                winnerNumber = random(0, 99);
                a++;
            }
            adminBalance -= obj[i][alpha][winnerNumber] * 90;
        }
        winnerNumbers[i][alpha] = winnerNumber
    }
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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
