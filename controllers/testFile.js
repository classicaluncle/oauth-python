/* eslint-disable no-console */
var settings = require('../utils/settings');

exports.index = function(){
    console.log('working')
    for(let x in settings.services){
        // let service = settings.lookup.x['type'];
        let service = settings.lookup[settings.services[x].type];

        // eslint-disable-next-line no-console
        console.log(service);
    }
}