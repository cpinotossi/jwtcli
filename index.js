#!/usr/local/bin/node

//Import Modules
const jwtSimple = require('jwt-simple');
const commander = require('commander');

//Define input parameter
commander
  .version('0.1.0')
  .option('-k --key [file]', 'private key path')
  .option('-p --payload [file]', 'jwt payload file path')
  .parse(process.argv);


//Validate input parameter key
if (typeof commander.key === 'undefined' ||typeof commander.payload === 'undefined' ) {
   console.error('no command given!');
   process.exit(1);
}

//Read key from file
var fs = require("fs");
var jwtPrivateKey = fs.readFileSync(commander.key);

//Read Json payload from file
var fs = require("fs");
var jwtPayloadRaw = fs.readFileSync(commander.payload);
var jwtPayload = JSON.parse(jwtPayloadRaw, null, 4);

//Define jwt alg to be used:
var jwtHeader = {
  "algorithm": "RS256"
};

var jwt = jwtSimple.encode(jwtPayload, jwtPrivateKey, jwtHeader.algorithm);
console.log("\n");
console.log(`jwt = ${jwt}`);

console.log("\n *EXIT* \n");
