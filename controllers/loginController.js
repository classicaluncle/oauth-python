var helperFunctions = require('../utils/helperFunctions');
var display = 'unknown';
var settings = require('../utils/settings');
var winston = require('winston');
var moment = require('moment');
var mongoose = require('mongoose'),
    FetchToken = require('FetchToken'),
    // FetchToken = require('../models/FetchToken');
    StateToken = mongoose.model('StateToken');
const https = require('https');

var password = require('../utils/passwordGenerator');
var simplecrypt = require('../services/simplecryptService');

// eslint-disable-next-line no-unused-vars
exports.loginHandler = function(req, res, next){

try {
    var state = req.get('state');
    var code = req.get('code');

    if(settings.testing){
        winston.info('Log-in with code %s, and state %s',code, state);
    }

    if(state == null || code == null){
        throw 'Response is missing state or code';
    }

    var statetoken = StateToken.findOne({'state':state});

    if(statetoken == null || statetoken == ''){
        throw 'No such state found';
    }

    var now = moment();
    if(statetoken.expires < now){
     throw 'State token has expired';   
    }

    var providerServiceObj = helperFunctions.find_provider_and_service(statetoken.service);

    display = providerServiceObj.provider.display;

    var redir_url = providerServiceObj.configLookup.redirect_url;

    if(req.get('token') != null || req.get('token') != ''){
        redir_url += req.get('token');
    }

    if(settings.testing){
        winston.info('Got log-in with url %s', redir_url);
        winston.info('sending to %s', providerServiceObj.provider['auth-url']);
    }

    var url = providerServiceObj.provider['auth-url'];

    var request_params = {

        'client_id': providerServiceObj.provider['client-id'],
        'redirect_uri': redir_url,
        'client_secret': providerServiceObj.provider['client-secret'],
        'state': state,
        'code': code,
        'grant_type': 'authorization_code'
    }

    // if(providerServiceObj.provider.hasOwnProperty('no-state-for-token-request')){

    // }

    var data = encodeURI(request_params);

    var headers = {'Content-Type':'application/x-www-form-urlencoded'};

    var content = '';

    https.get(url, data, headers, (resp) => {

        resp.on('data', (response) => {
          content += response;
        });

        resp.on('end', ()=>{
            // eslint-disable-next-line no-console
            console.log('done');
        })
    }).on("error",(err) => {

        // eslint-disable-next-line no-console
        console.log("Eoor" + err.message);
        
    });

    if(settings.testing){
        winston.info('Resp raw' + content)
    }

    if(providerServiceObj.provider.hasOwnProject('no-refresh-token')){
        let query = {'fetchtoken': statetoken.fetchtoken}
        let data = content.access_token;
        let fetchToken = FetchToken.findOneAndUpdate(query, data, {upsert: true},function(err, doc){
            if(err) return res.send(500,'server error');
            return res.send('Successfully saved');
        })

        //  Report results to the user
        var template_values = {
                'service': display,
                'appname': settings.APP_NAME,
                'longappname': settings.SERVICE_DISPLAYNAME,
                'authid': content.access_token,
                'fetchtoken': statetoken.fetchtoken
        };

        res.render('logged-in.html',{data,template_values});

    }

    // google oauth issues
    if(!providerServiceObj.provider.hasOwnProperty('resfresh_token')){
        if(providerServiceObj.provider.hasOwnProperty('deauthlink')){
            template_values = {
                'service': display,
                'authid': 'Server error, you must de-authorize ' + settings.APP_NAME,
                'showdeauthlink': 'true',
                'deauthlink': providerServiceObj.provider['deauthlink'],
                'fetchtoken': ''
            }
            res.render('logged-in.html',{data:template_values});
        }else{
            throw 'No refresh token found, try to de-authorize the application with the provider';
        }
    }


    // # v2 tokens are just the provider name and the refresh token
    //  # and they have no stored state on the server
    if(statetoken.version == 2){
        authid = 'v2:' + statetoken.service + ':' +res['refresh_token'];
        let query = {'fetchtoken': statetoken.fetchtoken}
        let fetchToken = FetchToken.findOneAndUpdate(query, auth, {upsert: true},function(err, doc){
            if(err) return res.send(500,'server error');
            return res.send('Successfully saved');
        })
        res.render('logged-in.html',{data:template_values});
        return;
    }

    if(res.hasOwnProperty('user_id')){
        var user_id = res['user_id'];
    }else{
        user_id = "N/A";
    }

    var exp_secs = 1800; //30 min guess
    try {
        exp_secs = int(res["expires_in"]);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
    }

    //   Create a random password and encrypt the response
    //   This ensures that a hostile takeover will not get access
    //   to stored access and refresh tokens
    var password = password.generate_password();

    var cipher = simplecrypt.encrypt(password, res);

    //convert to text and prepare for storage
    var b64_cipher = cipher.toString('base64');

    var expires = now.add(exp_secs);

    fetchToken = stateToken.fetchToken;

    var entry = None;
    var keyid = None;

    while(entry == null){
        return;
    }

   let authid = keyid + ':' + password;

    //update the database

    template_values = {
        'service': display,
        'appname': settings.app_name,
        'longappname': settings.SERVICE_DISPLAYNAME,
        'authid':authid,
        'fetchtoken':fetchToken
    }

    res.render('logged-in.html',{data: template_values});

    winston.info('Created new authid %s for service %s', keyid, providerServiceObj.provider['id']);

} catch (error) {

    // eslint-disable-next-line no-console
    console.error('handle error for'+display);

    template_values = {
        'service': display,
        'appname': settings.APP_NAME,
        'longappname': settings.SERVICE_DISPLAYNAME,
        'authid': 'Server error, close window and try again',
        'fetchtoken': ''
    }


    res.render('logged-in.html',{data:template_values});
    
}
}