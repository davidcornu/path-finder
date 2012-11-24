var methods = require('methods');
var keyRxp  = /:(\w+)/;

exports.extend = function(app){
  app._paths = {};

  app.addPath = function(pathName, pathString){
    var keyList = [];
    var buf     = [];

    pathString.split('/').forEach(function(part){
      if (keyRxp.test(part)) {
        var key = part.match(keyRxp)[1]
        buf.push('encodeURIComponent(keys["' + key + '"])');
        keyList.push(key);
      } else {
        buf.push('"' + part + '"');
      }
    });

    var template = new Function('keys', 'return ' + buf.join(' + "/" + ') + ';');

    app._paths[pathName] = function(keys){
      keys = keys || {};

      var queries = [];
      Object.keys(keys).forEach(function(k){
        if (keyList.indexOf(k) >= 0) return;
        queries.push(encodeURIComponent(k) + '=' + encodeURIComponent(keys[k]));
      });

      var queryString = queries.length > 0 ? '?' + queries.join('&') : null;
      return queryString ? template(keys) + queryString : template(keys);
    }
  }

  methods.concat('all').forEach(function(method){
    var original = app[method];
    app[method] = function(){
      var args = Array.prototype.slice.call(arguments);

      function proxy(){ return original.apply(app, args); }

      if (args.length < 3) return proxy();
      if (typeof args[0] !== 'string' || typeof args[1] !== 'string') return proxy();

      app.addPath(args[1], args[0]);
      args.splice(1,1);
      return proxy();
    }
  });

  app.path = function(pathName, keys){
    if (!app._paths[pathName]) throw 'Path ' + pathName + ' is not defined.';
    return app._paths[pathName](keys);
  }

  app.locals({p: app.path});
}