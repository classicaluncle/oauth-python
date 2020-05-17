'use strict'

/*handler to query the state of an active token*/
var winston= require('winston');
var moment = require('moment');
// eslint-disable-next-line no-unused-vars
exports.tokenStateHandler = function(req, res){
    try {
        var fetchToken = req.get('token');

        if(fetchToken == null || fetchToken == ''){
            return;
        }
        
        var entry = '';
        if(entry == null || entry == ''){
            return;
        }

        if(entry.expires < moment.now()){
            return;
        }

        if(entry.authid == null || entry.authid == ''){
            return;
        }

        res.status(200,'success');
        
    } catch (error) {
        winston.exceptions('handler error');
        res.status(500, 'Server error');
        
    }
}