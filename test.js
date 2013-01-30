var assert     = require('assert');
var express    = require('express');
var app        = express();
var pathFinder = require('./index.js');

describe('path-finder', function(){
  before(function(){
    pathFinder.extend(app);
  });

  it('should include deprecated methods in express app', function(){
    assert(app.addPath);
    assert(app.p);
  });

  it('should add a view helper', function(){
    assert(app.locals.p);
  });

  it('should proxy standard routing methods', function(){
    app.get('/hello', function(req, res){ return res.end('world'); });
    assert.equal('/hello', app.routes.get[0].path);
  });

  it('should add named routes when a name is passed', function(){
    app.get('/user', 'user', function(req, res){ return res.end('david'); });
    assert.equal('/user', pathFinder.path('user'));
  });

  it('should work with app.all', function(){
    app.all('/pages', 'pages', function(req, res){ return res.end('pages'); });
    assert.equal('/pages', pathFinder.path('pages'));
    assert.equal('/pages', app.routes.unsubscribe[0].path);
  })

  it('should accept parameter keys in routes', function(){
    app.post('/users/:userId/comments/:commentId/edit', 'edit_comment', function(req, res){
      return res.end('edit');
    });
    assert.equal('/users/10/comments/11/edit', pathFinder.path('edit_comment', {userId: 10, commentId: 11}));
  });

  it('should pass additional keys into query string', function(){
    app.put('/search', 'search', function(req, res){ return res.end('search'); });
    assert.equal('/search?q=david%20cornu', pathFinder.path('search', {q: 'david cornu'}));
    assert.equal('/search?q=poodles&p=1', pathFinder.path('search', {q: 'poodles', p: 1}));
  });

  it('should accept both param and query string options', function(){
    app.delete('/posts/:id', 'post', function(req, res){ return res.end('post'); });
    assert.equal('/posts/21?p=2', pathFinder.path('post', {id: 21, p: 2}));
  });

  it('should return identical results using the view helper', function(){
    assert.equal('/posts/21?p=2', app.locals.p('post', {id: 21, p: 2}));
  });

  it('should allow ad-hoc paths to be added', function(){
    pathFinder.addPath('directions', '/directions/:from/:to');
    assert.equal('/directions/paris/berlin', pathFinder.path('directions', {from: 'paris', to: 'berlin'}));
  });

  it('should throw for undefined paths', function(){
    assert.throws(function(){ pathFinder.path('booyah'); });
  });

  it('should not overwrite any of express\' internal methods', function(){
    var cleanApp = express();
    assert(!cleanApp._paths, 'does not overwrite app._paths');
    assert(!cleanApp.addPath, 'does not overwrite app.addPath');
    assert(!cleanApp.p, 'does not overwrite app.p');
  });
});