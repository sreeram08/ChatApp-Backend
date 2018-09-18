const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const chatController = require("./../controllers/chatController");
const chatRoomController = require("./../controllers/chatRoomController");
const appConfig = require("./../../config/appConfig");

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.


    // params: firstName, lastName, email, mobileNumber, password
    app.post(`${baseUrl}/signup`, userController.signUpFunction);
    /**
        * @apiGroup users
        * @apiVersion  1.0.0
        * @api {post} /api/v1/users/signup api for user SignUp.
        *
        * @apiParam {string} firstName First Name of the user. (body params) (required)
        * @apiParam {string} lastName Last Name of the user. (body params) (required)
        * @apiParam {string} email email of the user. (body params) (required)
        * @apiParam {string} password password of the user. (body params) (required)
        * @apiParam {Number} mobileNumber Mobile Number of the user. (body params) (required)
        *
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
           {
                "error": "false",
                "message": "User Created",
                "status": 200,
                "data": {
                    "__v": 0,
                    "_id": "5b55b2b93378f63094cb05fb",
                    "groups": [],
                    "createdOn": "2018-07-23T10:49:29.000Z",
                    "mobileNumber": 8920014205,
                    "email": "hanumantchidrawar@gmail.com",
                    "lastName": "Patil",
                    "firstName": "Hanumant",
                    "userId": "Sy-pfEQNX"
                }
            }
       */


    // params: email, password.
    app.post(`${baseUrl}/login`, userController.loginFunction);
    /**
        * @apiGroup users
        * @apiVersion  1.0.0
        * @api {post} /api/v1/users/login api for user login.
        *
        * @apiParam {string} email email of the user. (body params) (required)
        * @apiParam {string} password password of the user. (body params) (required)
        *
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
            {
               "error": false,
               "message": "Login Successful",
               "status": 200,
               "data": {
                   "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                   "userDetails": {
                   "mobileNumber": 2234435524,
                   "email": "someone@mail.com",
                   "lastName": "abc",
                   "firstName": "xyz",
                   "userId": "-E9zxTYA8"
               }
           }
        *  @apiErrorExample {json} Error-Response:
        *
        *  {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }   
       */

    app.get(`${baseUrl}/:userEmail/forgotPassword`, userController.sendResetLink);
    /**
         * @apiGroup users
         * @apiVersion  1.0.0
         * @api {get} /api/v1/users/:userEmail/forgotPassword to send an reset email to user.
         *
         * @apiParam {string} userEmail Email of the user. (route params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
                {
                    "error": false,
                    "message": "User Details Found",
                    "status": 200,
                    "data": "Mail sent successfully"
                }
        *  @apiErrorExample {json} Error-Response:
        *
        *  {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }        
        */


    app.post(`${baseUrl}/resetPassword`, userController.resetPassword);

    /**
         * @apiGroup users
         * @apiVersion  1.0.0
         * @api {post} /api/v1/users/resetPassword to change the password of user.
         *
         * @apiParam {string} userId Id of the user. (body params) (required)
         * @apiParam {string} password New password of the user. (body params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
                {
                    "error": false,
                    "message": "Mail sent Successfully",
                    "status": 200,
                    "data": "Password reset successfull"
                }
        *  @apiErrorExample {json} Error-Response:
        *
        *  {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }        
        */
    app.get(`${baseUrl}/getGroupChat`, chatController.getGroupChat);
    /**
         * @apiGroup chat
         * @apiVersion  1.0.0
         * @api {get} /api/v1/users/getGroupChat to get the group chat.
         *
         * @apiParam {string} chatRoomId Roorm Id of the chat group. (query params) (required)
         * @apiParam {string} skip page value of group chat. (query params) (optional)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "All Group Chats Listed",
                "status": 200,
                "data": [
                    {
                        "chatId": "S1SjOhOXQ",
                        "createdOn": "2018-07-15T12:05:49.077Z",
                        "seen": false,
                        "chatRoom": false,
                        "message": "Hello in another group",
                        "senderId": "H1_zVTeXX",
                        "senderName": "Hanumant Patil"
                    },
                    {
                        "chatId": "rk43d3dQm",
                        "createdOn": "2018-07-15T12:06:03.899Z",
                        "seen": false,
                        "chatRoom": false,
                        "message": "Hi in another group",
                        "senderId": "SJNYFW8Q7",
                        "senderName": "Krishna Patil"
                    }
                ]
            }
        *  @apiErrorExample {json} Error-Response:
        *
        *  {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }    
        */

    app.post(`${baseUrl}/createChatRoom`, chatRoomController.createChatRoom);
    /**
         * @apiGroup ChatGroup
         * @apiVersion  1.0.0
         * @api {post} /api/v1/users/createChatRoom to create Chat Group.
         *
         * @apiParam {string} userEmail email of the user creating chat group. (body params) (required)
         * @apiParam {string} roomName Name of the group to be created. (body params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "room saved to user details",
                "status": 200,
                "data": {
                    "__v": 0,
                    "admin": {
                        "Id": "Sy-pfEQNX",
                        "name": "HanumantPatil"
                    },
                    "_id": "5b55b7043378f63094cb05fc",
                    "status": true,
                    "members": [
                        {
                            "Id": "Sy-pfEQNX",
                            "name": "HanumantPatil"
                        }
                    ],
                    "createdOn": "2018-07-23T11:07:47.000Z",
                    "roomName": "First Group by new user",
                    "roomId": "SyoWPNXV7"
                }
            }
        *  @apiErrorExample {json} Error-Response:
        *
        * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
          }    
        */

    app.post(`${baseUrl}/joinChatRoom`, chatRoomController.joinChatRoom);
    /**
         * @apiGroup ChatGroup
         * @apiVersion  1.0.0
         * @api {post} /api/v1/users/joinChatRoom to join Chat Group.
         *
         * @apiParam {string} userEmail email of the user joining chat group. (body params) (required)
         * @apiParam {string} chatRoomId GroupId of the group to be Joined. (body params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "User & Group Saved",
                "status": 200,
                "data": {
                    "n": 1,
                    "nModified": 1,
                    "ok": 1
                }
            }
        *  @apiErrorExample {json} Error-Response:
        *
        * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }    
        */

    app.put(`${baseUrl}/deleteChatRoom`, chatRoomController.deleteChatRoom);
    /**
         * @apiGroup ChatGroup
         * @apiVersion  1.0.0
         * @api {put} /api/v1/users/deleteChatRoom to delete Chat Group.
         *
         *
         * @apiParam {string} chatRoomId GroupId of the group to be deleted. (body params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": true,
                "message": "Chat Room deleted",
                "status": 200,
                "data": {
                    "n": 1,
                    "ok": 1
                }
            }
        *  @apiErrorExample {json} Error-Response:
        *
        * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }    
        */

    app.post(`${baseUrl}/:chatRoomId/editChatRoom`, chatRoomController.editChatRoom);
    /**
     * @apiGroup ChatGroup
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/:chatRoomId/editChatRoom to edit Chat Group.
     *
     *
     * @apiParam {string} chatRoomId GroupId of the group to be edited. (route params) (required)
     * @apiParam {string}  roomName  New Name of the group. (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "chatRoom edited",
            "status": 200,
            "data": {
                "n": 1,
                "nModified": 1,
                "ok": 1
            }
        }
    *  @apiErrorExample {json} Error-Response:
    *
    * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
      }    
    */
    app.post(`${baseUrl}/sendInvite`, chatRoomController.sendInvite);
    /**
         * @apiGroup ChatGroup
         * @apiVersion  1.0.0
         * @api {post} /api/v1/users/sendInvite to send an invite to other user to join Chat Group.
         *
         *
         * @apiParam {string} chatRoomId GroupId of the group to be whoose invite will be sent. (body params) (required)
         * @apiParam {string}  userEmail email of the user whom invite is to sent. (body params) (required)
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
             {
                "error": false,
                "message": "Mail sent Successfully",
                "status": 200,
                "data": null
    
            }
          *  @apiErrorExample {json} Error-Response:
          *
          * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }    
        */
    app.get(`${baseUrl}/getChatRooms`, chatRoomController.getChatRooms);
    /**
         * @apiGroup ChatGroup
         * @apiVersion  1.0.0
         * @api {get} /api/v1/users/getChatRooms to get all the chat groups of the Group chat application.
         *
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "Groups found",
                "status": 200,
                "data": [
                    {
                        "_id": "5b48821d512db705b021fa7e",
                        "admin": {
                            "name": "HanumantPatil",
                            "Id": "H1_zVTeXX"
                        },
                        "__v": 0,
                        "status": true,
                        "members": [
                            {
                                "name": "HanumantPatil",
                                "Id": "H1_zVTeXX"
                            },
                            {
                                "Id": "SJNYFW8Q7",
                                "name": "Krishna Patil"
                            }
                        ],
                        "createdOn": "2018-07-13T10:42:37.000Z",
                        "roomName": "First Group",
                        "roomId": "ryLQMWImm"
                    }
                ]
            }
          *  @apiErrorExample {json} Error-Response:
          *
          * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }

        */
    app.get(`${baseUrl}/:chatRoomId/getChatRoom`, chatRoomController.getChatRoom);
    /**
         * @apiGroup ChatGroup
         * @apiVersion  1.0.0
         * @api {get} /api/v1/users/:chatRoomId/getChatRoom to get  the chat group of the Group chat application.
         *
         * @apiParam {string} chatRoomId GroupId of the group whoose details will be returned. (route params) (required)
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "Group found",
                "status": 200,
                "data": {
                    "_id": "5b542d11eda72f35e06cc5ce",
                    "admin": {
                        "name": "KrishnaPatil",
                        "Id": "SJNYFW8Q7"
                    },
                    "__v": 0,
                    "status": true,
                    "members": [
                        {
                            "name": "KrishnaPatil",
                            "Id": "SJNYFW8Q7"
                        }
                    ],
                    "createdOn": "2018-07-22T07:06:57.000Z",
                    "roomName": "First Group by new user",
                    "roomId": "H1tfajbNX"
                }
            }
          *  @apiErrorExample {json} Error-Response:
          *
          * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }    
        */

    app.get(`${baseUrl}/:userEmail/getUser`, userController.getUser);
    /**
         * @apiGroup user
         * @apiVersion  1.0.0
         * @api {get} /api/v1/users/:userEmail/getUser to get all details about the user.
         *
         * @apiParam {string} userEmail email of user whoose details will be returned. (route params) (required)
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "User found",
                "status": 200,
                "data": 
                    {
                        "_id": "5b43440f9063530f6437fcc4",
                        "__v": 0,
                        "groups": [
                            "ryLQMWImm",
                            "rJXdG-8m7"
                        ],
                        "createdOn": "2018-07-09T11:16:31.000Z",
                        "mobileNumber": 8920014205,
                        "email": "hanmantchidrawar@gmail.com",
                        "password": "$2a$10$q0jdVsSlhOQ.fOArQNRsqeuTOHYql.eEL9GsV6BoQVbFcSpa.8PwO",
                        "lastName": "Patil",
                        "firstName": "Hanumant",
                        "userId": "H1_zVTeXX"
                    }
            }
          *  @apiErrorExample {json} Error-Response:
          *
          * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }
        */

    app.get(`${baseUrl}/:chatRoomId/closeGroup`, chatRoomController.closeChatRoom);
    /**
         * @apiGroup ChatGroup
         * @apiVersion  1.0.0
         * @api {get} /api/v1/users/:chatRoomId/closeGroup to close the chat group from the Group chat application.
         *
         * @apiParam {string} chatRoomId GroupId of the group which will be marked as closed. (route params) (required)
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "Group found & marked close",
                "status": 200,
                "data": {
                    "n": 1,
                    "nModified": 1,
                    "ok": 1
                }
            }
          *  @apiErrorExample {json} Error-Response:
          *
          * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }    
        */

    // auth token params: userId.
    app.post(`${baseUrl}/:userId/logout`, userController.logout);
    /**
         * @apiGroup users
         * @apiVersion  1.0.0
         * @api {post} /api/v1/users/:userId/logout to logout user.
         *
         * @apiParam {string} userId userId of the user. (route params) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": true,
                "message": "User logged Out",
                "status": 200,
                "data": {
                    "n": 0,
                    "ok": 1
                }
            }
          *  @apiErrorExample {json} Error-Response:
          *
          * {
                "error": true,
                "message": string,
                "status": number,
                "data": any
            }
     */
}
