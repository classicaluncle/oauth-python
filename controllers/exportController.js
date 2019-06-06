'use strict'

/*Handler that exports the refresh token,
for use by the backend handlers*/

var settings = require('../utils/settings');
var winston = require('winston');
var simplecrypt = require('../services/simplecryptService');

// eslint-disable-next-line no-unused-vars
exports.exportHanlder = function(req, res){
    try {
        if(settings.api_key.length < 10 || req.headers['X-APIKey'] != settings.api_key){
            if(settings.api_key.length < 10){
                winston.info('No api key loaded');
            }
            res.headers['X-Reason'] = 'Invalid API KEY';
            res.status(403,'Invalid API key');
            return;

        }
        var authid = res.headers['X-AuthID'];

        if(authid == '' || authid == null){
            res.headers['X-Reason'] = 'No authid in query';
            res.status(400,'No authid in query');
            return;
        }

        if(authid.indexOf(':') <= 0){
            res.headers['X-Reason'] = 'No v2 exports possible';
            res.status(400,'No v2 exports possible');
            return;
        }

        // find the entry
        var entry = '';
        if(entry == null || entry == ''){
            res.headers['X-Reason'] = 'No such key';
            res.status(404,'No such key');
            return;
        }

        //decode
        var data = base64.b64decode(entry.blob);
        res = '';

        //decrypt
        try {
            res = simplecrypt.decrypt(password, data).decode('utf8');

        } catch (error) {
            winston.exceptions('decrypt error');
            res.headers['X-Reason'] = 'Invalid authid password';
            res.status(400,'Invalid authid password');
            return;
        }

        res['service'] = entry.service;
        winston.info('Exported %s bytes for keyid %s');

        //write the results back to the user
        res.headers['Content-Type'] = 'application/json';

    } catch (error) {
        winston.exceptions('handler error');
        res.headers['X-Reason'] = 'Server error';
        res.status(500,'Server Error');
    }
}   