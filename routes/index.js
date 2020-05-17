'use strict'

module.exports = function(app){
  var indexController = require('../controllers/indexController');
  
  app.route('/').get(indexController.index);
}