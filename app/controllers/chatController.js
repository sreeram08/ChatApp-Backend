/**
 * module dependencies.
 */
const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/passwordLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')

/* Models */
const ChatModel = mongoose.model('Chat')
const UserModel = mongoose.model('User')
const AuthModel = mongoose.model('Auth')


/**
 * function to retrieve chat of the group.
 * params: chatRoom, skip.
 */
let getGroupChat = (req, res) => {
    // function to validate params.
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.query.chatRoomId)) {
                logger.info('parameters missing', 'getUsersChat handler', 9)
                let apiResponse = response.generate(true, 'parameters missing.', 403, null)
                reject(apiResponse)
            } else {
                resolve()
            }
        })
    } // end of the validateParams function.

    // function to get chats.
    let findChats = () => {
        return new Promise((resolve, reject) => {
            // creating find query.
            let findQuery = {
                receiverId: req.query.chatRoomId
            }

            ChatModel.find(findQuery)
                .select('-_id -__v -receiverName -receiverId')
                .sort('-createdOn')
                .skip(parseInt(req.query.skip) || 0)
                .lean()
                .limit(10)
                .exec((err, result) => {
                    if (err) {
                        logger.error(err.message, 'Chat Controller: getGroupChat', 10)
                        let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(result)) {
                        logger.info('No Chat Found', 'Chat Controller: getGroupChat')
                        let apiResponse = response.generate(true, 'No Chat Found', 404, null)
                        reject(apiResponse)
                    } else {
                        // reversing array.
                        let reverseResult = result.reverse()
                        resolve(result)
                    }
                })
        })
    } // end of the findChats function.

    // making promise call.
    validateParams()
        .then(findChats)
        .then((result) => {
            let apiResponse = response.generate(false, 'All Group Chats Listed', 200, result)
            res.send(apiResponse)
        })
        .catch((error) => {
            res.send(error)
        })
} // end of the getGroupChat function.   

/**
 * exporting functions.
 */
module.exports = {
    getGroupChat: getGroupChat
}
