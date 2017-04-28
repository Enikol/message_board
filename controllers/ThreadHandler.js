var mongoose = require('mongoose');
var express = require('express');
var Thread = require('../models/thread-model');

function ThreadHandler(){
this.postThread = function(req, res){
  console.log(req.params.board, 'post');
  var newThread = new Thread({
    text: req.body.text,
    delete_password: req.body.delete_password,
    created_on: new Date(),
    bumped_on: new Date(),
    reported: false,
    replies: [],
    replycount: 0,
    board: req.params.board
  })
  newThread.save();
  res.redirect('/b/'+req.params.board+'/');  
}

this.postReply = function(req, res){
  Thread.findById(req.body.thread_id, function(err, foundThread){
    if (err) return;
    if (foundThread){
      foundThread.bumped_on = new Date();
      foundThread.replycount += 1;
      foundThread.replies.push({
        text: req.body.text,
        delete_password: req.body.delete_password,
        created_on: new Date(),
        reported: false
      })
      foundThread.save();
      
    }
  })
    res.redirect('/b/'+req.params.board+'/'+req.body.thread_id);
}
this.getReplies = function(req, res){
  console.log(req.params.board, 'reply');
  Thread.findById(req.query.thread_id, function(err, foundThread){
    if (err) return;
    if (foundThread){
       foundThread.delete_password = undefined;
       foundThread.reported = undefined;
      foundThread.replies.forEach(function(reply){
         reply.delete_password = undefined;
         reply.reported = undefined;
      })
      res.json(foundThread);
      /*{text: foundThread.text,
               replies: foundThread.replies,
               created_on: foundThread.created_on,
               bumped_on: foundThread.bumped_on,
               _id: foundThread._id}*/
    }
  })
}

this.getThreads = function(req, res){
  console.log(req.params.board, 'list');
  Thread.find({board: req.params.board}).sort({bumped_on: -1}).limit(10).exec(function (err, docs){
    if (err) return;
    docs.forEach(function(doc){
          if(doc.replies.length > 3) {
          doc.replies = doc.replies.slice(-3);
          }
          doc.delete_password = undefined;
          doc.reported = undefined;
          })
    res.json(docs);
  })
}

this.deleteThread = function(req, res){
  Thread.findById(req.body.thread_id, function(err, foundThread){
    if (err) return;
    if (foundThread){
      if (foundThread.delete_password === req.body.delete_password){
        foundThread.remove();
        res.send('success');
      } else {
        res.send('incorrect password');
      }
    }
  })
}

this.deleteReply = function(req, res){
  Thread.findById(req.body.thread_id, function(err, foundThread){
    if (err) return;
    if (foundThread){
      var reply = foundThread.replies.id(req.body.reply_id);
      if (reply.delete_password === req.body.delete_password){
        reply.text = '[deleted]';
        foundThread.save();
        res.send('success');
      } else {
        res.send('incorrect password');
      }
    }
  })
}

this.reportThread = function(req, res){
  Thread.findById(req.body.thread_id, function(err, foundThread){
    if (err) return;
    if (foundThread){
        foundThread.reported = true;
        foundThread.save();
        res.send('reported');
    } else {res.send('not found')};
  })
}

this.reportReply = function(req, res){
  Thread.findById(req.body.thread_id, function(err, foundThread){
    if (err) return;
    if (foundThread){
      var reply = foundThread.replies.id(req.body.reply_id);
        reply.reported = true;
        foundThread.save();
        res.send('reported');
    }
  })
}
}
 module.exports = ThreadHandler;