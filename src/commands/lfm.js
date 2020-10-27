const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class LFMCommand extends Command {

    constructor() {
        super({
            name: 'lfm',
            description: 'Returns a link to the specified user\'s last.fm profile. ' +
            'If no user is specified, the bot will return a link to your profile. ',
            usage: [
                'lfm',                 
				'lfm @<username>'                 
            ],
            aliases: ['profile']
        })
    }

    async run(client, message, args) {
		const { bans, users, crowns } = client.models
		let user
        if (args.length === 0) {
			user = await users.findOne({
				where: {
					userID: message.author.id
				}
			})
        } else {
			user = await users.findOne({
				where: {
					userID: message.mentions.members.first().id
				}
			})
        }		

		try{
			await message.reply('here\'s a link to the profile that you requested: https://last.fm/user/'+user.username)
		}catch{
			await message.reply('the user you requested probably doesn\'t have a last.fm account setup with me.')
		}
    }

}

module.exports = LFMCommand