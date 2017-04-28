/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var server = require('../server');

chai.use(chaiHttp);

var id1;
var id2;
var repID1;

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Create 2 threads', function(done){
      chai.request(server)
        .post('/api/threads/test')
        .send({
          text: 'Testing post request 1',
          delete_password: 'delete'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          //expect(res).to.redirectTo('http://shrouded-consonant.glitch.me/b/test');
        done();
      });
      });
      test('2nd', function(done){
      chai.request(server)
        .post('/api/threads/test')
        .send({
          text: 'Testing post request 2',
          delete_password: 'delete'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          //expect(res).to.redirectTo('http://shrouded-consonant.glitch.
          done();
        });
      });
    });
    
    
    suite('GET', function() {
      test('Get a list of threads', function(done){
      chai.request(server)
        .get('/api/threads/test')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], '_id');
          assert.notProperty(res.body[0], 'delete_password');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.notProperty(res.body[0], 'reported');
          assert.equal(res.body[0].text, 'Testing post request 2');
          id1 = res.body[1]._id;
          id2 = res.body[0]._id;
          done();
        });
      });
    

    });
    
    suite('DELETE', function() {
      test('Try with incorrect password', function(done){
      chai.request(server)
        .delete('/api/threads/test')
        .send({
          thread_id: id2,
          delete_password: 'password'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
        done();
        })
      });
      test('Delete 2nd thread', function(done){
      chai.request(server)
        .delete('/api/threads/test')
        .send({
          thread_id: id2,
          delete_password: 'delete'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
        done();
        })
      });
      test('Check array for 2nd thread', function(done){
        chai.request(server)
        .get('/api/threads/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'text');
          assert.notProperty(res.body[0], 'delete_password');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.notProperty(res.body[0], 'reported');
          assert.equal(res.body[0].text, 'Testing post request 1');
          done();
        });
      });
    });
    
    suite('PUT', function() {
      
      test('Report', function(done){
      chai.request(server)
        .put('/api/threads/test')
        .send({
          thread_id: id1,
          report: true
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
      });
      
    
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
  
    suite('POST', function() {
      test('Create 1st reply', function(done){
      chai.request(server)
        .post('/api/replies/test')
        .send({
          thread_id: id1,
          text: 'Testing reply 1',
          delete_password: 'delete'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
        done();
      });
      });
     /* test('Create 2nd reply', function(done){
      chai.request(server)
        .post('/api/replies/test')
        .send({
          thread_id: id1,
          text: 'Testing reply 2',
          delete_password: 'delete'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
         done();
        });
      });*/
    });
    
    suite('GET', function() {
      test('Get 1 thread', function(done){
      chai.request(server)
        .get('/api/replies/test')
        .query({thread_id: id1})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'text');
          assert.notProperty(res.body, 'delete_password');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.notProperty(res.body, 'reported');
          assert.property(res.body, 'replies');
          assert.equal(res.body.text, 'Testing post request 1');
          assert.isArray(res.body.replies);
          assert.equal(res.body.replies[0].text, 'Testing reply 1');
          repID1 = res.body.replies[0]._id;
          done();
        });
      });
    
    });
    
    suite('PUT', function() {
      test('Report', function(done){
      chai.request(server)
        .put('/api/replies/test')
        .send({
          thread_id: id1,
          reply_id: repID1,
          report: true
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('Try with incorrect password', function(done){
      chai.request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: id1,
          reply_id: repID1,
          delete_password: 'password'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
        done();
        })
      });
      test('Delete reply', function(done){
      chai.request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: id1,
          reply_id: repID1,
          delete_password: 'delete'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
        done();
        })
      });
      test('Check array', function(done){
        chai.request(server)
        .get('/api/replies/test')
        .query({thread_id: id1})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.replies);
          assert.equal(res.body.replies[0].text, '[deleted]')
          done();
        });
      });
    });
    });
    
  });


