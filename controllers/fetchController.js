exports.FetchHandler = function(req, res){
    // Handler that returns the authid associated with a token
    var fetchToken = req.get('token');

    // check if fetch token is empty
    if(fetchToken == '' || fetchToken == null){
        return res.json({'error':'Missing token'});
    }

    //fetch token from the database
    var entry = FetchToken.findOne(fetchToken);

    if(!entry){
        return res.json({'error':'Entry does not exist'});
    }

    if(entry.expires < Math.floor(new Date().getTime()/1000)){
        return res.json({'error':'No such Entry'});
    }

    if(entry.authid == null){
        res.json({'wait':'Not ready'});
    }

    entry.fetched = True;
    //update the database with this value
    entry.update();

}