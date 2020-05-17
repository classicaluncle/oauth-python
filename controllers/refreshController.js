'use strict'

/*Handler that retrieves a new access token,
    by decrypting the stored blob to retrieve the
    refresh token, and then requesting a new access
    token*/
var winston = require('winston');
var settings = require('../utils/settings');
var memcache = require('memcached');

exports.refreshHandler = function(req, res){

    get(){
        let authid = req.get('authid');

        if(authid == null || authid == ''){
            authid = req.headers['X-AuthID'];
        }

        return this.process(authid);
    };

    post(){
        let authid = req.get('authid');

        if(authid == null || authid == ''){
            authid = req.headers['X-AuthID'];
        }

        return this.process(authid);
    };

    process(){
        var serviceType = 'Unknown';
        
        try {
            if(authid == none || authid == ''){
                winston.info('No authid in query');
                res.headers['X-Reason'] = 'No authid in query';
                res.status(400,'No authid in query');
                return;
            }          
            if(authid.indexOf(':') <= 0){
                winston.info('Invalid authid in query');
                res.headers['X-Reason'] = 'Invalid authid in query';
                res.status(400,'Invalid authid in query');
                return;
            }  

            var keyid = authid;
            password = authid;

            if(settings.WORKER_OFFLOAD_RATIO > Math.random()){
                var workers = memcache.get('worker-urls');

                if(workers != none || workers == ''){
                    var newloc = random.choice('workers');
                    winston.info('redirecting request');
                    res.status(302,'Found');
                    return;
                }
            }

            if(keyid == 'v2'){
                this.handle_v2(password);
                return;
            }

            if(settings.RATE_LIMIT > 0){
                var ratelimiturl = '/ratelimit?id=' + keyid + '&adr=' + req.remote_addr;
                ratelimit = memcache.get(ratelimiturl);

                if(ratelimit == null){
                    memcache.add(key=ratelimiturl, value=1, time = 60*60);
                }else if( ratelimit > settings.RATE_LIMIT ){ 
                    winston.info('Rate limit response to:')
                    res.headers['X-Reason'] = 'Too many requests for this key, wait 60 mins';
                    res.status(503,'Too many requests for this key wait 60 min');
                    return;
                }else{
                    memcache.incr(ratelimiturl);
                }
            }

            var cacheurl ='/refresh?id=' + keyid + '&h=' + hashblib;

            var cache_res = memcache.get(cacheurl);
        } catch (error) {
            
        }
    }
}