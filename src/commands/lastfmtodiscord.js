const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class LastfmToDiscordCommand extends Command {

    constructor() {
        super({
            name: 'lastfmtodiscord',
            description: 'Returns the discord name the corresponds to a specified last.fm profile. ' +
            'This only works if the user is logged into this bot.',
            usage: [                
				'lastfmtodiscord <last.fm username>'                 
            ],
            aliases: ['lfm2d','l2d']
        })
    }

    async run(client, message, args) {
		const { bans, users, crowns } = client.models
		let user
		let allusers
        if ((args.length === 0)||(args.length>1)) {
			await message.reply('you need to specify a last.fm username.')
        } else {
			allusers = await users.findAll()
        }
		let uu=""
		for(let i=0;i<allusers.length;i++){
			if(allusers[i].username.toLowerCase()==args[0].toLowerCase()){
				uu=allusers[i].userID
			}
		}		
		try{
			await message.reply('**'+args[0]+'** is **'+ message.guild.members.cache.get(uu).user.username+'**.')
		}catch{
			await message.reply('I can\'t find **'+args[0]+'**. That user may not be logged into me.')
		}
    }

}

module.exports = LastfmToDiscordCommand