const fs = require('fs');

//{"digitcount" : "000000000"}

async function digits(seed1 , seed2){
    let digitsJSON = require(__dirname + "/digitsjson.json")
  

    console.log(digitsJSON.digitcount)

        let finalSeed = null
    if ((seed1 - seed2) > 0 ) {
        finalSeed = seed1 - seed2
    } else if ((seed1 - seed2 < 0)) {
        finalSeed = (seed1 - seed2) * -1
    } else {
        finalSeed = 1
    }

    let publishDigits = { "digitcount" : parseInt(digitsJSON.digitcount) + finalSeed}


    fs.writeFile(__dirname + "/digitsjson.json", JSON.stringify(publishDigits), err => {
     
        // Checking for errors
        if (err) throw err; 
       
        console.log("Done writing"); // Success
    })
    let checkDigitsJSON = require(__dirname + "/digitsjson.json")
     console.log("Publish Digits = " + publishDigits.digitcount)
     console.log("Digits written to JSON = " + checkDigitsJSON.digitcount)

  }
  
// TEST SYSTEM
// function getRandomArbitrary(min, max) {
//     return parseInt(Math.round(Math.random() * (max - min) + min));
//   }

// function seedmake(){
//     let seed = getRandomArbitrary(1, 14)
//     console.log(seed)
//     return seed
// }
  
//   digits( seedmake() , seedmake() )

  module.exports = { digits }