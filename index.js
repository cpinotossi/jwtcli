#!/usr/local/bin/node

//Good to know
//https://itnext.io/making-cli-app-with-ease-using-commander-js-and-inquirer-js-f3bbd52977ac

//Import Modules
const jwtSimple = require('jwt-simple');
const jwtDecode = require('jwt-decode');
const program = require('commander');


//Example:
// jwtcli g -k ~/workspace/jwtcli/private/qtip.pem.key -p ~/workspace/jwtcli/private/qtip.cpt.json
// jwtcli g -k ~/workspace/jwtcli/private/qtip.pem.key -c client-munich -a auth-groups
program
  .command('generate')
  .alias('g')
  .description('Generate JWT')
  .version('0.1.0')
  .option('-k --key [file]', 'private key file path')
  .option('-p --payload [file]', 'jwt payload file path')
  .option('-c --clientid [value]', 'jwt claim client id')
  .option('-a --authgroup [value]', 'jwt claim Authorization Group')
  .action(function(args){
    if (typeof args.key === 'undefined') {
       console.error('no key given!');
       process.exit(1);
    }else{
      if (typeof args.payload !== 'undefined' ) {
         jwtPayload = generateJWTPayloadFromFile(args.payload, args.payload, function(payload){
           generateJWT(args.key, payload);
         });
      }else{
        if (typeof args.clientid !== 'undefined' && typeof args.authgroup !== 'undefined' ) {
          jwtPayload = generateJWTPayloadFromValues(args.clientid, args.authgroup, function(payload){
            generateJWT(args.key, payload);
          });

        }else{
          console.error('no command given!');
          process.exit(1);
        }
      }
    }
  });

  //Example:
  // jwtcli d -j eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJjbGllbnRJZCI6ImNsaWVudC1tdW5pY2giLCJhdXRoR3JvdXAiOiJhdXRoLWdyb3VwcyJ9.aeE_Bu8aCEsOKlvg8Mb9YjI4hhoohUoPhCvpMXi7XR1Ub85Co9hBH-vjnCw6N1ERI5_TX5MKpzMtdgj7i0PwwVgWufE9Lvr--_fn_y8VFoy8RtH4lFvQsucRpQwkAiPVvf2mJOS2pE36XX_JG332nlZI03yONPga7tXCFoZ5cu-2jUj03l6u6vAeT-1svCKtW0F-dbqDjgd1zfHQZuzhHfsJ78cWYNnvYVyv1NZ39qNjM4-ERoE_OHdQ0oGnmMLIL2bR5cOIusbtglOssbKh78FAV58b5TB9zCkz7WI4Nhgvw14qupLIs-VhMQO_lR3Xs_NQ7PFrVwhf4eIhimOXdMt1Cetsp8BpKy-UyNIBknN7_qC-DMgRpsZ5CFrRSZU-BQxTK9oJATiyjmWPCTYIBfal2JTTozHg6-LGE1FpkkPp_XaPu8iQH18g-qXSFAVnfg-CbLOJsyv6XMCO8ESgZUnZucfmrmgnTmy6x9lKfjouZGc8RjIWiiDAfzjUueVx0pU_8g2maZPyLh0psbB7Kq6_12LTlUVIWP0B-TbmJB3-_BWUH-m8aG8cMQtr8a34gvQPwgMVCOCOEqYrnd_l4IqAlGq7XYrU1ooJA_c3vg9i2vS_OsjyDv7EILyngSrbv58KAViHFDgrD7C02w2D4N_AGlo-CZgDLnh8bntfQoM
  program
    .command('decode')
    .alias('d')
    .description('Generate JWT')
    .version('0.1.0')
    .option('-j --jwt [value]', 'jwt to be decoded')
    .action(function(args){
      if (typeof args.jwt === 'undefined') {
         console.error('no key given!');
         process.exit(1);
      }else{
            console.log(jwtDecode(args.jwt));
      }
    });
  program.parse(process.argv);

function generateJWT(keyFilePath, jwtPayload){
  //Read key from file
  var fs = require("fs");
  var jwtPrivateKey = fs.readFileSync(keyFilePath);
  //Define jwt alg to be used:
  var jwtHeader = {
    "algorithm": "RS256"
  };
  var jwt = jwtSimple.encode(jwtPayload, jwtPrivateKey, jwtHeader.algorithm);
  console.log(jwt);
}

function generateJWTPayloadFromFile(url, payloadFilePath, cb){
  //Read Json payload from file
  var fs = require("fs");
  var jwtPayloadRaw = fs.readFileSync(payloadFilePath);
  var jwtPayload = JSON.parse(jwtPayloadRaw, null, 4);
  cb(jwtPayload);
}
function generateJWTPayloadFromValues(clientId, authGroup, cb){
  var jwtPayload = {
    clientId: clientId,
    authGroup: authGroup
  };
  cb(jwtPayload);
}
