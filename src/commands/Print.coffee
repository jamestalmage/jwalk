Command = require './Command'
recast = require 'recast'

class Print extends Command

	help: ->
		'prints the ast at this point'

	run: (context, args, callback) ->
		if !(recast.types.namedTypes.Node).check(context.pointer)
			console.log('not on a node'.red)
		else
			console.log(recast.print(context.pointer).code)
		callback()

module.exports = Print