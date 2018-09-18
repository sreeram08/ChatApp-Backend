//redis Lab
const check = require("./checkLib");
const redis = require("redis");
let client = redis.createClient({
    url: "redis://redis-18631.c16.us-east-1-3.ec2.cloud.redislabs.com:18631",
    no_ready_check: true,
    auth_pass: "shreeram08#"
});

client.on('connect',() => {
    console.log("Redis connection successfully opened");
});

let getAllUsersInAHash = (hashName, callback) => {
    
    client.HGETALL(hashName, (err, result) => {
        console.log(`Getting all online users from hash ${hashName}`);

        if(err){
            console.log(err);
            callback(err, null);
        }
        else if(check.isEmpty(result)){
            console.log("online user list is empty");
            console.log(result);
            callback(null,{});
        }
        else{
            console.log(result);
            callback(null,result);
        }
    });//end HGETALL
}//end getAllUsersInAHash

let setANewOnlineUserInHash = (hashName, key, value, callback) => {

    console.log(`setting user ${key} with value ${value} in hash ${hashName}`);

    client.HMSET( hashName, [
        key, value
    ], (err, result) => {
        if(err){
            console.log(err);
            callback(err,null);
        }else{
            console.log("user has been set in hash map");
            console.log(result);
            callback(null, result);
        }
    });//end HMSET
}//end set a new online user in hash

let deleteUserFromHash = (hashName,key) => {

    client.HDEL(hashName,key);
    return true;
}//end delete user from hash

module.exports = {
    getAllUsersInAHash: getAllUsersInAHash,
    setANewOnlineUserInHash: setANewOnlineUserInHash,
    deleteUserFromHash: deleteUserFromHash
}