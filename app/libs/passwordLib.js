const bcrypt = require('bcrypt');
const shortid = require('shortid');
const saltRounds = 10;

let hashpassword= (plainTextPassword) =>{
   
    let salt= bcrypt.genSaltSync(saltRounds);
    let hash= bcrypt.hashSync(plainTextPassword,salt);      
    return hash;
}

let comparePassword= (plainTextPassword, hashpassword,cb) => {

    bcrypt.compare(plainTextPassword, hashpassword, (err, res) => {
        if(err){
            logger.error(err.message, 'Comparison Error', 5);
            cb(err, null);
        }
        else{
            cb(null, res);
        }
    });
}

let comparePasswordSync = (plainTextPassword, hashpassword) => {
    return bcrypt.compareSync(plainTextPassword,hash);
}

module.exports = {
    hashpassword: hashpassword,
    comparePassword: comparePassword
}