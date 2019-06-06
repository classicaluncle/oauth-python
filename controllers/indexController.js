var mongoose = require('mongoose'),
    // FetchToken = require('../models/FetchToken');
    FetchToken = mongoose.model('FetchToken');
var moment = require('moment');
var settings = require('../utils/settings');
// eslint-disable-next-line no-unused-vars
exports.index = function(req, res, next){
 
    
    // if the request contains a token 
    // register this with a limited lifetime
    // so the caller can grab the authid automatically
    if(req.get('token' )!= null || req.get('token') != ''){
        let now = moment();
        let fetchedToken = FetchToken.findOne({'token': req.get('token')});
        // let new_fetchtoken = New FetchToken();
        if(fetchedToken != ''){
           // eslint-disable-next-line no-unused-vars
           var auths = new FetchToken({
                            auth_id:req.get('token'),
                            token: req.get('token'),
                            expires:now.add(5,'minutes'),
                            fetched:false
                        })
        }

    }

    let filtertype = req.get('token');
    let tokenversion = settings.default_token_version;

    try {
        if(req.get('tokenversion') != null || res.get('tokenversion') != ''){
            tokenversion = parseInt(req.get('tokenversion'));
        }
    }finally{
        // eslint-disable-next-line no-console
        console.log('pass the try')
    }

    var templateitems = [];

    for(let x in settings.services){
        let service = settings.lookup[settings.services[x].type];

        //if there is a ?type=parameter, filter the results
        if(filtertype != null && filtertype != x['id'])
            continue;
        
        //if the client id is invalid  or missing, skip the entry
        if(service['client-id'] == null || service['client-id'] == 'xxxxxxxx')
            continue;
        
        if(filtertype != null && x.hasOwnProperty('hidden') && x['hidden'])
            continue;
        
        var link = '/login?id' + x['id'];

        if(req.get('token') != null){
            link += '&token' + req.get('token');
        }

        if(tokenversion != ''){
            link += '&tokenversion='+tokenversion.toString();

        }

        var notes = '';
        if(x.hasOwnProperty('notes')){
            notes = x['notes'];
        }

        var brandimg = '';
        if(x.hasOwnProperty('brandimage')){
            brandimg = x['brandimage'];
        }

        templateitems.push({
            'display': x['display'],
            'authlink': link,
            'id': x['id'],
            'notes': notes,
            'servicelink': x['servicelink'],
            'brandimage': brandimg
        });

      
    }

    // eslint-disable-next-line no-console
    console.log(templateitems);

    res.render('index', {items:templateitems});
}