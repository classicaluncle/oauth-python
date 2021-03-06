'use strict'
//this is a representational datastore using mongodb 
//instead of the google app engine db
var mongoose = require('mongoose');

var schema = mongoose.Schema;


var AuthTokenSchema = new schema({
    user_id:{
        type: String,
        required: true
    },
    blob:{
        type: String,
        required: true
    },
    expires:{
        type: Date,
        required: true
    },
    service:{
        type:String,
        required: true
    }
});

module.exports = mongoose.model('AuthToken', AuthTokenSchema);