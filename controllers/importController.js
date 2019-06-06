'use strict'

// Handler that imports the refresh token,
//     for use by the backend handlers
var settings = require('../utils/settings');
var simplecrypt = require('../services/simplecryptService');
var winston = require('winston');
var moment = require('moment');

exports.importHandler = function(req, res){
    try {
        if(settings.API_kEY < 10 || req.headers['X-APIKey'] != settings.API_kEY){
            res.headers['X-Reason'] = 'Invalid API key';
            res.status(403,'Invalid API Key');
            return;
        }

        var authid = req.headers['X-AuthID'];

        if(authid == null || authid ==''){
            res.headers['X-Reason'] = 'No authid in query';
            res.status(400,'No authid in query');
            return;
        }

        if(authid.indexOf(':') <= 0){
            res.headers['X-Reason'] = 'Invalid authid in query';
            res.status(400,'Invalid authid in query');
            return;
        }

        var keyid = authid[authid.indexOf(':')];
        var password = authid[authid.indexOf(':') + 1];

        if(keyid == 'v2'){
            res.headers['X-Reason'] = 'No V2 import possble';
            res.status(400,'No v2 import possible');
            return;
        }

        //find the entry
        var entry = '';
        if(entry == '' || entry == null){
            res.headers['X-Reason'] = 'No such key';
            res.status(404,'No such key');
            return;
        }

        // decode
        // eslint-disable-next-line no-undef
        var data = base64.decode(entry.blob);
        res = null;

        // decrypt
        try {
            res = simplecrypt.decrypt(password, data).decode('utf9');

        } catch (error) {
            res.headers['X-Reason'] = 'Invalid authid password';
            res.status(400,'Invalid Authid password');
            return;
        }

        if(!res.refresh_token){
            winston.info('Import blob does not contain a refresh token');
            res.headers['X-Reason'] = 'Import blob does not contain a refresh token';
            res.status(400,'Import blob does not contain a refresh token');
            return;
        }

        if(!res.expires_in){
            winston.info('Import blob does not contain expires_in');
            res.headers['X-Reason'] = 'Import blob does not contain expires_in';
            res.status(400,'Import blob does not contain expires_in');
            return;
        }

        winston.info('Import %s bytes for keyid %s');

        res['services'] = entry.service;
        var exp_secs = parseInt(res['expires_in']) - 10

        var now = moment.now();
        var cipher = simplecrypt.encrypt(password, res);
        entry.expires = now + exp_secs;
        // eslint-disable-next-line no-undef
        entry.blob = base64.b64encode(cipher);
        entry.put();

        // write the results back to the client
        res.headers['Content-Type'] = 'application/json';
        res.write(res);

        

    } catch (error) {
        res.headers['X-Reason'] = 'Server Error'
        res.status(500,'Server Error');
        throw "handle error";
        

    }
}