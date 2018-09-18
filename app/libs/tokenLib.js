const jwt = require('jsonwebtoken');
const shortid= require('shortid');
const secretKey = "ThisIsTheSampleKeyForGeneratingTheJsonWebTokenForMyChatApplicationApplicationProgrammingInterface";

let generateToken = (data, cb) => { 

    try{
        let claims = {
            jwtid : shortid.generate(),
            iat: Date.now(),
            sub: 'authToken',
            exp: Math.floor(Date.now() / 1000)+(60*60*24),
            iss: 'GroupChatApp',
            data: data
        }
        let tokenDetails = {
            token: jwt.sign(claims, secretKey),
            tokenSecret: secretKey
        }

        cb(null, tokenDetails)
    }catch(err){
        console.log(err);
        cb(err,null);
    }

}//end generateToken

let verifyClaims = (token, tokenSecret, cb) => {

    //verify a token
    jwt.verify(token, tokenSecret, function(err, decoded){

        if(err){
            console.log("error while verify token");
            console.log(err);
            cb(err,null);
        }
        else{
            console.log("user verified");
            console.log(decoded);
            cb(null,decoded);
        }
    });
}//end verifyClaims

let verifyClaimsWithoutSecret = (token, cb) => {

    //verify a token
    jwt.verify(token, secretKey, function(err, decoded){

        if(err){
            console.log("error while verify token");
            console.log(err);
            cb(err,null);
        }
        else{
            console.log("user verified");
            console.log(decoded);
            cb(null,decoded);
        }
    });
}//end verifyClaimsWithoutSecret

module.exports = {
    generateToken: generateToken,
    verifyClaims: verifyClaims,
    verifyClaimsWithoutSecret: verifyClaimsWithoutSecret
}