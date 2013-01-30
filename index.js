var methods     = require('methods');
var querystring = require('querystring');
var keyRxp      = /:(\w+)/;

var _paths = {};

function addPath(pathName, pathString){
  var keyList = [];
  var buf     = [];

  pathString.split('/').forEach(function(part){
    if (keyRxp.test(part)) {
      var key = part.match(keyRxp)[1];
      buf.push('encodeURIComponent(keys["' + key + '"])');
      keyList.push(key);
    } else {
      buf.push('"' + part + '"');
    }
  });

  var template = new Function('keys', 'return ' + buf.join(' + "/" + ') + ';');

  _paths[pathName] = function(keys){
    keys = keys || {};
    var query = {};
    Object.keys(keys).forEach(function(k){
      if (keyList.indexOf(k) >= 0) return;
      query[k] = keys[k];
    });
    var qs = querystring.stringify(query);
    return qs ? template(keys) + '?' + qs : template(keys);
  };
};

function path(pathName, keys){
  if (!_paths[pathName]) throw new Error('Path ' + pathName + ' is not defined.');
  return _paths[pathName](keys);
}

function extend(app){
  app.addPath = function(){
    console.log('app.addPath is deprecated, see https://github.com/davidcornu/path-finder for details');
    return addPath.apply(null, arguments);
  }

  app.p = function(){
    console.log('app.p is deprecated, see https://github.com/davidcornu/path-finder for details');
    return path.apply(null, arguments);
  }

  app.locals({p: path});

  methods.concat('all').forEach(function(method){
    var original = app[method];
    app[method] = function(){
      var args = Array.prototype.slice.call(arguments);

      function proxy(){ return original.apply(app, args); }

      if (args.length < 3) return proxy();
      if (typeof args[0] !== 'string' || typeof args[1] !== 'string') return proxy();

      addPath(args[1], args[0]);
      args.splice(1,1);
      return proxy();
    }
  });
};

module.exports = {
  path: path,
  addPath: addPath,
  extend: extend
};