var Command = require('./Commmand');
var _ = require('underscore');
var recast = require('recast');
var types = recast.types;
var n = types.namedTypes;

function Find(){}

var Fp = Find.prototype = new Command();

Fp.help = function () {
  return 'Depth first search for the given node type'
};

Fp.autocomplete = function(context, str, callback) {
  var keys, matches, results;
  if(!_.isObject(context.pointer)){
    return callback ( null, [[], str] );
  }
  keys = _.keys(n);
  matches = _.filter(keys, function(key) {
    return key.indexOf(str) === 0;
  });
  results = matches.length > 0 ? matches : keys;
  return callback(null, [results, str]);
};

Fp.run = function(context, args, callback){
  if(!args.length) {
    console.log('You must supply an Node Type'.red);
  }
  var typeName = args[0];
  var type = n[typeName];
  if(type) {
    console.log(typeName.yellow + ' is not a known Node Type'.red);
  }
  var found = false;

  types.visit(context.pointer, {
    visitNode:function(path){
      if(found) return false;
      if(type.check(path)){
        found = true;
        var newPointer = path.node;
        while(path.node !== context.pointer){
          context.path.push(path.parentPath.name, path.name);
          path = path.parent;
        }
        context.pointer = newPointer;
        return false;
      } else {
        this.traverse(path);
        return;
      }
    }
  });

  if(!found){
    console.log(typeName.yellow + ' not found'.red);
  }

  callback();

}

