'use strict'

/*renders the revoke.html page*/

var settings = require('../services/simplecryptService');

exports.revokeHandler = function(req, res){

    var template_values = {
        'appname': settings.service_displayname
    }

    res.render('revoke.html',{data:template_values});
}