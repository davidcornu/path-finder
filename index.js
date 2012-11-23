var methods = require('methods');

exports.extend = function(app){

  app._paths = {};

  app.addPath = function(pathName, pathString){
    // var testString = '/:userId/:postId/:commentId/edit';
    // var buf = [];

    // testString.split('/').forEach(function(part){
    //     if (!/:(\w+)/.test(part)) return buf.push('"' + part + '"');
    //     buf.push('keys["' + part.match(/:(\w+)/)[1] + '"]');
    // });

    // var body = buf.join(' + "/" + ');

    // var template = new Function('keys', '  return ' + body + ';');

    // console.log(template({userId: 'david', postId: 1, commentId: 10}));
    // console.log(template);
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