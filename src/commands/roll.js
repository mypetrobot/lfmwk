const Command = require('../handler/Command')

class RollCommand extends Command {

    constructor() {
        super({
            name: 'roll',
            description: 'Roll a die of a specified number of sides.',
            usage: ['roll <sides>'],
			hidden: true,
            aliases: ['rl']
        })
    }

    async run(client, message, args) {
		if (args.length === 0) {
			await message.reply("you rolled a "+(Math.floor(Math.random()*6)+1)+".")
		}else{
			const sides=parseInt(args[0])
			if(sides<2){				
				await message.reply("nice try, but you rolled a "+(Math.floor(Math.random()*6)+1)+".")
			}else{
				let roll=(Math.floor(Math.random()*sides)+1)
				let msg="you rolled a"
				if((roll==18)||(roll.toString().indexOf('8')==0)||(roll==11)){
					msg+="n"
				}
				msg+=" "+roll+"."
				await message.reply(msg)
			}
		}
    }

}

module.exports = RollCommand