'use strict'

// Creates a state and redirects the user to the login page
var helperFunctions = require('../utils/helperFunctions');
var mongoose = require('mongoose'),
    StateToken = mongoose.Schema('StateToken'),
    winston = require('winston');

// eslint-disable-next-line no-unused-vars
exports.redirectToLoginHandler = function(req, res){
    try {
        
        var providerServiceObj = helperFunctions.find_provider_and_service(req.get('id'));

        var stateentry = '';

        while(stateentry == null){
            var statetoken = '';
            stateentry = StateToken.find();

        }

        var link = providerServiceObj.configLookup['login-url'];
        link += '?client_id='+providerServiceObj.configLookup['client-id'];
        link += '&response_type=code';
        link += '&scope='+ providerServiceObj.provider['scode'];
        link += '&state=' + statetoken;

        if(providerServiceObj.provider.hasOwnProperty('extraurl')){
            link += '&' + providerServiceObj.provider['extraurl'];
        }
        link += '&redirect_Url'+ providerServiceObj.configLookup['redirect-url'];

        //redirect to url

    } catch (error) {
        winston.exceptions('handle error');
        res.status(500, 'Server Error');
        
    }
}