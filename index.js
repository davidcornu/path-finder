var methods = require('methods');
var keyRxp  = /:(\w+)/;

exports.extend = function(app){

  app._paths = {};

  app.addPath = function(pathName, pathString){
    var buf = [];

    pathString.split('/').forEach(function(part){
        if (keyRxp.test(part)) {
          buf.push('encodeURIComponent(keys["' + part.match(keyRxp)[1] + '"])');
        } else {
          return buf.push('"' + part + '"');
        }
    });

    var body = [
      '  keys = keys || {};'
      '  return ' + buf.join(' + "/" + ') + ';'
    ].join('\n');

    app._paths[pathName] = new Function('keys', body);
  }

  methods.concat('all').forEach(function(method){
    var original = app[method];
    app[method] = function(){
      var args = Array.prototype.slice.call(arguments);

      function proxy(){ return original.apply(apps, args); }

      if (args.length < 3) return proxy();
      if (typeof args[0] !== 'string' || typeof args[1] !== 'string') return proxy();

      app.addPath(args[1], args[0]);
      args.splice(1,1);
      return proxy();
    }
  });

  app.path = function(){
    var args = Array.prototype.slice.call(arguments);
    if (args.length == 0) return;
    var pathName = args.shift();
  }

}