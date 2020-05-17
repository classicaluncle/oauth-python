'use strict'

var settings = require('../utils/settings'),
    https = require('https'),
    winston = require('winston'),
    Memcached = require('memcached'),
    memcached = new Memcached('localhost:3000');

exports.checkAliveHandler = function () {
    // Handler that exports the refresh token,
    // for use by the backend handlers

    if (settings.worker_urls == null) {
        return;
    }

    var data = '%030x';

    var validhosts = [];

    for (var n in settings.worker_urls) {
        try {
            let url = n[-'refresh'.length] + "isalive?data=" + data;
            winston.info('checking if server is alive: %s', url);
            var content = '';
            https.get(url, (resp) => {

                resp.on('data', (response) => {
                    content += response;
                });

                resp.on('end', () => {
                    // eslint-disable-next-line no-console
                    console.log('done');
                })

            }).on("error", (err) => {

                // eslint-disable-next-line no-console
                console.log("Eoor" + err.message);

            });
            if (content == '' || content == null) {
                winston.info('Bad response, was %s, should have been %s');
            } else {
                validhosts.push(n);
            }


        } catch (error) {
            throw 'handler error';

        }
    }

    winston.info('Valid hosts are: %s', validhosts);
    memcached.add(settings.worker_urls, validhosts, 1);

}