var Command = require('./Command');
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
  var steps = buildSteps(args);
  if(!steps) {
    console.log('You must supply an valid Node Type'.red);
    callback();
    return;
  }

  var path = [];
  var newNode = walk(context.pointer, path, steps);

  if(!newNode){
    console.log('Nothing found for that path'.red);
  }
  else {
    context.pointer = newNode;
    context.path = context.path.concat(path);
  }
  callback();
};

function walk(node, jwalkPath, steps){
  if(!steps.length || !node) return node;

  var step = steps.shift();
  var type = step[0];
  var count = step[1];
  var foundNode = null;

  types.visit(node, {
    visitNode:function(path){
      if(count < 0) return false;
      if(type.check(path.node)){
        count --;
        if(count < 0){
          var pathPart = [];
          foundNode = walk(path.node, pathPart, steps);
          while(path.node !== node){
            pathPart.unshift( path.name);
            path = path.parentPath;
          }
          jwalkPath.push.apply(jwalkPath,pathPart);
        }
        return false;
      } else {
        this.traverse(path);
        return;
      }
    }
  });

  return foundNode;
}

function buildSteps(args, steps){
  if(!args.length) return steps || null;
  args = args.slice();
  steps = steps || [];
  var typeName = args.shift();
  var type = n[typeName];
  if(!type) {
    console.log(typeName.yellow + ' is not a valid Node Type'.red);
    return null;
  }
  if(hasLeadingNumArg(args)){
    while(hasLeadingNumArg(args)){
      steps.push([type, parseInt(args.shift())]);
    }
  } else {
    steps.push([type,0]);
  }
  return buildSteps(args, steps);
}

function hasLeadingNumArg(args){
  return args.length && !isNaN(args[0]);
}

module.exports = Find;

