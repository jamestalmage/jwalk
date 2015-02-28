Command = require './Command'
recast = require 'recast'

class Print extends Command

	help: ->
		'prints the ast at this point'

	run: (context, args, callback) ->
		console.log(recast.print(context.pointer).code)
		callback()

module.exports = Inspect