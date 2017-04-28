/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ThreadHandler = require('../controllers/ThreadHandler');
var mongoose = require('mongoose');
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
mongoose.connect(CONNECTION_STRING);

module.exports = function (app) {
  var threadHandler = new ThreadHandler();
  app.route('/api/threads/:board')
 
  .get(threadHandler.getThreads)
  .post(threadHandler.postThread)
  .delete(threadHandler.deleteThread)
  .put(threadHandler.reportThread)
  
  app.route('/api/replies/:board')
  .post(threadHandler.postReply)
  .get(threadHandler.getReplies)
  .delete(threadHandler.deleteReply)
  .put(threadHandler.reportReply)
  
};
