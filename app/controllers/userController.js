const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib');
const check = require('../libs/checkLib');
const passwordLib = require('./../libs/passwordLib');
const token = require('./../libs/tokenLib');
const mailer = require('./../libs/mailerLib');

/* Models */
const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('Auth')


// start user signup function 

let signUpFunction = (req, res) => {

    let validateUserInput = () => {

        return new Promise((resolve, reject) => {
            if (req.body.email) {

                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, "Email does not meet the requirements", 400, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, "Password parameter is missing", 400, null);
                    reject(apiResponse);
                }
                else {
                    resolve(req);
                }

            }
            else {
                logger.error('Field Missing during User Creation', 'userContoller: createUser()', 10);
                let apiResponse = response.generate("true", "one or more parameter(s) are missing", 500, null);
                reject(apiResponse);
            }
        });
    }//end validateUserInput

    let createUser = () => {

        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, "userController:createUser()", 10);
                        let apiResponse = response.generate("true", "Failed to create user", 500, null);
                        reject(apiResponse);
                    }
                    else if (check.isEmpty(retrievedUserDetails)) {
                        let newUser = new UserModel({
                            // userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || ' ',
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobileNumber,
                            password: passwordLib.hashpassword(req.body.password),
                            createdOn: time.now()
                        });
                        newUser.save((err, newUser) => {
                            if (err) {
                                logger.error(err.message, "userController: createUser", 10);
                                let apiResponse = response.generate("true", "failed to create user", 403, null);
                                reject(apiResponse);
                            }
                            else {
                                let newUserObj = newUser.toObject();
                                mailer.autoEmail(newUserObj.email, "<h2>Welcome to Group Chat Application</h2>");
                                resolve(newUserObj);
                            }
                        });
                    } else {
                        logger.error("user cannot be created, user already present", "userController: createUser", 10);
                        let apiResponse = response.generate("true", "Failed to create user", 403, null);
                        reject(apiResponse);
                    }
                });
        });
    }//end createUser

    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password;
            let apiResponse = response.generate("false", "User Created", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err) => {
            res.send(err);
        });

}// end user signup function 


let sendResetLink = (req, res) => {
    if (check.isEmpty(req.params.userEmail)) {
        logger.error("UserEmail is missing", "UserController: logOut", 10);
        let apiResponse = response.generate(true, "UserEmail is missing", 500, null);
        res.send(apiResponse);
    } else {
        UserModel.findOne({ email: req.params.userEmail }, (err, userDetails) => {
            /* handle the error if the user is not found */
            if (err) {
                logger.error('Failed to retrieve user Data', "userController: findUser()", 10);
                let apiResponse = response.generate(true, "failed to find the user with given email", 500, null);
                res.send(apiResponse);
            }/* if company details is not found */
            else if (check.isEmpty(userDetails)) {
                logger.error("No User Found", "userController: findUser()", 10);
                let apiResponse = response.generate(true, "No user Details Found", 500, null);
                res.send(apiResponse);
            }
            else {
                logger.info("user found", "userController: findUser()", 10);
                mailer.autoEmail(req.params.userEmail, `<a href='http://localhost:4200/resetPassword/${userDetails.userId}'>click here to reset password</a>`);
                let apiResponse = response.generate(false, "User Details Found", 200, "Mail sent successfully");
                res.send(apiResponse);
            }
        });
    }
}//sendResetLink

let resetPassword = (req, res) => {

    let findUser = () => {

        return new Promise((resolve, reject) => {
            if (req.body.userId) {
                UserModel.findOne({ userId: req.body.userId }, (err, userDetails) => {
                    /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve user Data', "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "failed to find the user with given email", 500, null);
                        reject(apiResponse);
                    }/* if company details is not found */
                    else if (check.isEmpty(userDetails)) {
                        logger.error("No User Found", "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "No user Details Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info("user found", "userController: findUser()", 10);
                        resolve(userDetails);
                    }
                });
            }
            else {
                let apiResponse = response.generate(true, "UserId parameter is missing", 500, null);
                reject(apiResponse);
            }
        });
    }//end findUser()

    let updatePassword = (userDetails) => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.password)) {
                logger.error("password is missing", "UserController: logOut", 10);
                let apiResponse = response.generate(true, "Password is missing", 500, null);
                reject(apiResponse);
            } else {
                UserModel.update({ userId: req.body.userId }, { password: passwordLib.hashpassword(req.body.password) }, { multi: true }, (err, result) => {

                    if (err) {
                        logger.error("Failed to change Password ", "userController: resetPassword", 10);
                        let apiResponse = response.generate(true, "Failed to change Password", 500, null);
                        reject(apiResponse);
                    }
                    else if (check.isEmpty(result)) {
                        logger.error("User Not found", "userController: resetPassword", 10);
                        let apiResponse = response.generate(true, "User not found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info("Password updated", "userController: resetPassword", 10);
                        mailer.autoEmail(userDetails.email, `<b> Hi ${userDetails.firstName} ${userDetails.lastName}, your password has been changed succesfully</b>`);
                        resolve("Password reset successfull");
                    }
                });
            }
        });
    }//end update password

    findUser(req, res)
        .then(updatePassword)
        .then((message) => {
            let apiResponse = response.generate(false, "Mail sent Successfully", 200, message);
            res.status(200);
            res.send(apiResponse);
        })
        .catch((err) => {
            res.status(err.status);
            res.send(err);
        });


}//end reset password


// start of login function 
let loginFunction = (req, res) => {

    let findUser = () => {

        return new Promise((resolve, reject) => {
            if (req.body.email) {
                UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
                    /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve user Data', "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "failed to find the user with given email", 500, null);
                        reject(apiResponse);
                    }/* if company details is not found */
                    else if (check.isEmpty(userDetails)) {
                        logger.error("No User Found", "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "No user Details Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info("user found", "userController: findUser()", 10);
                        resolve(userDetails);
                    }
                });
            }
            else {
                let apiResponse = response.generate(true, "email parameter is missing", 500, null);
                reject(apiResponse);
            }
        });
    }//end findUser()

    let validatePassword = (retrievedUserDetails) => {
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    logger.error(err.message, "userController:ValidatePassword", 10);
                    let apiResponse = response.generate(true, "Login Failed", 500, null);
                    reject(apiResponse);
                }
                else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject();
                    delete retrievedUserDetailsObj.password;
                    delete retrievedUserDetailsObj._id;
                    delete retrievedUserDetailsObj.__v;
                    delete retrievedUserDetailsObj.createdOn;
                    delete retrievedUserDetailsObj.modifiedOn;
                    resolve(retrievedUserDetailsObj);
                }
                else {
                    logger.info('login Failed due to invalid password', "userController: validatePassword", 10);
                    let apiResponse = response.generate(true, "Password is incorrect", 500, null);
                    reject(apiResponse);
                }
            });
        });
    }//end validateUser()

    let generateToken = (userDetails) => {
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    let apiResponse = response.generate(true, "Failed to generate Token", 500, null);
                    reject(apiResponse);
                }
                else {
                    tokenDetails.userId = userDetails.userId;
                    tokenDetails.userDetails = userDetails;
                    resolve(tokenDetails);
                }
            });
        });
    }//end generateToken

    let saveToken = (tokenDetails) => {

        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    logger.error(err.message, "userController: saveToken", 10);
                    let apiResponse = response.generate(true, "Failed To Generate Token", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    });
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            logger.error(err.message, "userController: saveToken", 10);
                            let apiResponse = response.generate(true, "Failed To save Token", 500, null);
                            reject(apiResponse);
                        }
                        else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody);
                        }
                    });
                }
                else {
                    retrievedTokenDetails.authToken = tokenDetails.token;
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret;
                    retrievedTokenDetails.tokenGenerationTime = time.now();

                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            logger.error(err.message, "userController: saveToken", 10);
                            let apiResponse = response.generate(true, "Failed To Generate Token", 500, null);
                            reject(apiResponse);
                        }
                        else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody);
                        }
                    });
                }
            });
        });
    }//end of saveToken()

    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, "login Successful", 200, resolve);
            res.status(200);
            res.send(apiResponse);
        })
        .catch((err) => {
            res.status(err.status);
            res.send(err);
        });
}// end of the login function 


let logout = (req, res) => {
    if (check.isEmpty(req.params.userId)) {
        logger.error("UserId is missing", "UserController: logOut", 10);
        let apiResponse = response.generate(true, "UserId is missing", 500, null);
        res.send(apiResponse);
    } else {
        AuthModel.remove({ userId: req.params.userId }, (err, result) => {
            if (err) {
                logger.error("Failed to logOut user", "UserController: logout", 10);
                let apiResponse = response.generate(true, "Failed to logOut user", 500, null);
                res.send(apiResponse);
            }
            else if (check.isEmpty(result)) {
                logger.error("Invalid AuthToken/ authToken expired", "UserController: logout", 10);
                let apiResponse = response.generate(true, "Invalid AuthToken/ authToken expired", 500, null);
                res.send(apiResponse);
            }
            else {
                logger.info("User Logged Out", "UserController: logoutr", 10);
                let apiResponse = response.generate(true, "User logged Out", 200, result);
                res.send(apiResponse);
            }
        });
    }
} // end of the logout function.

let getUser = (req, res) => {

    if (check.isEmpty(req.params.userEmail)) {
        logger.info('UserEmail parameter missing', 'userController: getUserr', 9)
        let apiResponse = response.generate(true, 'User Email parameter missing.', 403, null)
        res.send(apiResponse)
    }
    else {
        UserModel.find({email: req.params.userEmail}, (err, userDetails) => {
            /* handle the error if the user is not found */
            if (err) {
                logger.error('Failed to find user', "userController: getUser", 10);
                let apiResponse = response.generate(true, "failed to find the user", 500, null);
                res.send(apiResponse);
            }/* if company details is not found */
            else if (check.isEmpty(userDetails)) {
                logger.error("No user Found", "UserController: getUser", 10);
                let apiResponse = response.generate(true, "No User Found", 500, null);
                res.send(apiResponse);
            }
            else {
                logger.info("User found", "UserController: getUser", 10);
                let apiResponse = response.generate(false, "User found", 200, userDetails);
                res.send(apiResponse);

            }
        });
    }
}//end getUser

module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout,
    sendResetLink: sendResetLink,
    resetPassword: resetPassword,
    getUser: getUser

}// end
