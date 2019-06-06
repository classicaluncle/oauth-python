/* eslint-disable no-console */
'use strict'

var settings = require('./settings');

exports.find_provider_and_service = function( id ){
    
    let provider = {}
    for(var x in settings.services){
        if(id == settings.services[x].id){
            provider = settings.services[x];
        }
    }

    var configObj = {
        provider: provider,
        configLookup: settings.lookup[provider.type]
    };

    return configObj;
}

exports.find_service = function(id){

    let idParam = id.toLowerCase();

    if(settings.lookup.hasOwnProperty(idParam)){
      
        return settings.lookup[idParam.valueOf()];
    }

    var settingsObj = {}
    settingsObj = this.find_provider_and_service(idParam);

    return settingsObj;

}
