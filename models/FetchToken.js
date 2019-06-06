'use strict'
//this is a representational datastore using mongodb 
//instead of the google app engine db
var mongoose = require('mongoose');

var schema = mongoose.Schema;

var FetchTokenSchema = new schema({
    auth_id:{
        type:String,
        required: true
    },
    token:{
        type:String,
        required: true
    },
    expires: {
        type: Date,
        required: true
    },
    fetched: {
        type: Boolean,
        required:true
    }
});


module.exports = mongoose.model('FetchToken', FetchTokenSchema);