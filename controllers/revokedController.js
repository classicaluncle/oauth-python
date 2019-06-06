'use strict'

var winston = require('winston');
var settings = require('../utils/settings');

// Revokes an issued auth token, and renders the revoked.html page

exports.revokedHandler = function(req, res){
    try {
        var authid = req.get('authid');
        if(authid == null || authid == ''){
            return "Error: No auth in query";
        }
        if(authid.indexOf(":") <= 0){
            return "Error: Invalid authid in query";
        }

        var keyid = authid;
        var password = authid;


        if(keyid == 'v2'){
            return "Error: The token must be revoked from the service provider. You can de-authorize the application on the storage providers website.";
        }

        var entry = '';
        if(entry == null || entry == ''){
            return "Error: No such user";
        }
        var data = base64.b64decode(entry.blob);
        var res = '';

        try {
            res = data;

        } catch (error) {
            winston.exceptions('handler error');
            return 'Error: Server error';
        }

        entry.delete();
        var template_values = {
            'result':"revoked",
            'appname': settings.SERVICE_DISPLAYNAME
        }

        res.render('revoked.html',{data: template_values});

        return "Token revoked";

      

    } catch (error) {
       winston.exceptions('Handler error');
       return 'Error: Server Error'; 
    }

    
}