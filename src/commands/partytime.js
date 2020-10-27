const Command = require('../handler/Command')

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

class PartyTimeCommand extends Command {

    constructor() {
        super({
            name: 'partytime',
            description: 'Counts down from a specified number.',
            usage: [
				'partytime',
				'partytime <number 3-10>'
			],
            aliases: ['pt'],
			hidden: true
        })
    }

    async run(client, message, args) {
		if ((message.channel.id == "260438376270921729")||(message.channel.id == "476130950812794881")||(message.channel.id == "703164704281067531")||(message.channel.id == "700537145860816976")) {
			return;
		}
		if((message.member.roles.has('260438982075088923'))||(message.member.roles.has('638219179010293781'))||(message.member.roles.has('686764941574668314'))){
			let cd=5;
			if (args.length > 0){				
				cd=parseInt(args[0])				
				if((cd<3)||(cd>10)||(isNaN(cd))){
					await message.reply('we\'re not having that kind of party.')
					return
				}else{
					
				}
			}
		
			await message.channel.send("**The party begins in...**")
			
			const counter = setInterval(() => {
				  if (cd > -1) {
					if(cd>0){
						message.channel.send("**"+(cd)+"**")
					}else{	
						message.channel.send("🎉 **NOW** 🎊")
					}
					cd--
				  } else {
					clearInterval(counter)
				  }
			}, 2000)
			//await message.channel.send("🎉 **NOW** 🎊")
		}
    }

}

module.exports = PartyTimeCommand