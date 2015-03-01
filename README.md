**ast-walk** provides an easy way to inspect the [ast](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
created by javascript parsers. The interface provided is a lot like a typical shell,
with familiar commands like `cd` and `ls`.

From the command line, it will load javascript files from disk and use [recast](https://github.com/benjamn/recast)
to parse them. You can also provide ast's (potentially from other parsers) via code.

This project is a fork of [jwalk](https://github.com/nkohari/jwalk) which provides essentially the same
utility for large JSON objects.

Before using this project, you definitely want to check out esprimas [online parser demo](http://esprima.org/demo/parse.html).
You may find it easier to use, and all you need.

## Installation

More documentation (and fewer bugs) coming soon. In the meantime, install it via npm:

```
npm install -g ast-walk
```

## Running
And then run it like this:

```
ast-walk somefile.js
```

It can also handle gzipped files. If the extension is .gz, it will decompress the javscript automatically.
(This is a left over feature from jwalk, and unlikely to be useful in the javascript context).

```
ast-walk somefile.js.gz
```

Most of the documentation below is unmodified from jwalk, and so discusses json. Just apply the same
principles to your ast nodes. New ast specific commands include **print** and **find**.

## Possible Commands

Given the following json file

````javascript
{
  "name": "jwalk",
  "version": "0.0.4",
  "description": "command-line json inspector",
  "preferGlobal": "true",
  "repositories": {
    "type": "git",
    "url": "http://github.com/nkohari/jwalk"
  },
  "bin": {
    "jwalk": "bin/jwalk"
  },
  "dependencies": {
    "coffee-script": "1.4.0",
    "colors": "0.6.0-1",
    "filesize": "1.6.6",
    "underscore": "1.4.2"
  },
  "engine": "node >= 0.8.x"
}
````

### Help

Shows this help message

```
jwalk obj{8} / $ help

cd navigates through nodes in the tree
clear clears the screen
cls clears the screen
exit quit jwalk
find performs a depth first search for the given node type
help shows this help message
keys examines the keys of an object node
ls examines a single node
print prints the ast at this point
quit quit jwalk
```

### Print

Prints the javascript at the current node

```
ast-walk obj{4} /program/body/0 $ print
function hello(name){
  console.log('hello ' + name);
}
```

### Find

Perform a depth first search for a given node type.
The first argument supplied is the desired node type to find and provides autocompletion hints

```
ast-walk obj{4} / $ print

  var a = 'hello';
  function helloMessage(name){
    return 'hello ' + name;
  }
  function byeMessage(name){
    return 'bye ' + name;
  }
  function hello(name){
    console.log(message(name));
  }

ast-walk obj{4} / $ find ReturnStatement
ast-walk obj{3} /program/body/1/body/body/0 $ print

   return 'hello ' + name;

ast-walk obj{3} /program/body/1/body/body/0 $ cd /
ast-walk obj{4} / $ find FunctionDeclaration 1
ast-walk obj{3} /program/body/2/body/body/0 $ print

  function byeMessage(name){
    return 'bye ' + name;
  }
```

The optional second argument allows you to skip the first X elements of a given type.
`find FunctionDeclaration 2` would skip the first 2 FunctionDeclarations returning the third.
Note that when a node is "skipped", none of it's children will be searched, this allows
a (sorta-kinda) breadth first search. You can create a chain as long as you'd like:

```
 ast-walk obj{4} / $ find FunctionDeclaration 2 IfStatement 2 IfStatement ReturnStatement
```

### List

Examines the current node

```
ast-walk obj{8} / $ ls
{ name: 'jwalk',
  version: '0.0.4',
  description: 'command-line json inspector',
  preferGlobal: 'true',
  repositories:
   { type: 'git',
     url: 'http://github.com/nkohari/jwalk' },
  bin: { jwalk: 'bin/jwalk' },
  dependencies:
   { 'coffee-script': '1.4.0',
     colors: '0.6.0-1',
     filesize: '1.6.6',
     underscore: '1.4.2' },
  engine: 'node >= 0.8.x' }
```

### Change Directory

Allows navigation through the JSON tree. Note 'cd' does support autocomplete by pressing the tab key.

```
ast-walk obj{8} / $ cd dependencies
ast-walk obj{4} /dependencies $ ls
{ 'coffee-script': '1.4.0',
  colors: '0.6.0-1',
  filesize: '1.6.6',
  underscore: '1.4.2' }
```

### Clear

Clears the screen

```
ast-walk obj{8} / $ clear
```
or

```
ast-walk obj{8} / $ cls
```

### Keys

Examines the keys of a node

```
ast-walk obj{8} / $ keys
[ 'name',
  'version',
  'description',
  'preferGlobal',
  'repositories',
  'bin',
  'dependencies',
  'engine' ]
```

### Quit

Exits the ast-walk application

```
ast-walk obj{8} / $ exit
```
or

```
ast-walk obj{8} / $ quit
```

## Preferences File

You can create a JSON file at `~/.ast-walk` to define preferences. Right now, all it supports is defining aliases for commands, like so:

```json
{
  "aliases": {
    "l": "ls"
  }
}
```

## Contributing

Bug reports and pull requests welcome!
