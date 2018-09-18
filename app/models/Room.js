const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const time = require('./../libs/timeLib');

const Room = new Schema({
    roomId: {
        type: String,
        default: 0,
        index: true,
        unique: true
    },
    roomName: {
        type: String,
        default: "New Group"
    },
    admin: {},
    createdOn: {
        type: Date,
        default: time.now
    },
    members:[],
    status:{
        type: Boolean,
        default: true
    } 
});

mongoose.model('Room', Room);