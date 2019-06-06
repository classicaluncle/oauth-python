'use strict'
//this is a representational datastore using mongodb 
//instead of the google app engine db
var mongoose = require('mongoose');

var schema = mongoose.Schema;



var StateTokenSchema = new schema({
    services:{
        type:String,
        required: true
    },
    expires: {
        type: Date,
        required: true
    },
    fetchtoken:{
        type:String,
        required: true
    },
    version: {
        type:Number,
        required: true
    }
});

module.exports = mongoose.model('StateToken', StateTokenSchema);