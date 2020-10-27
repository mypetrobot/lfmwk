const Command = require('../handler/Command')

class UsernameCommand extends Command {

    constructor() {
        super({
            name: 'username',
            description: 'Change the last.fm username of a specified user.',
            usage: ['username'],
			hidden: true
        })
    }

    async run(client, message, args) {
		const { bans, users, crowns } = client.models
		if((message.member.roles.has('638219179010293781'))||(message.author.id==client.ownerID)){
			const discorduser=message.mentions.members.first().user	
			console.log(discorduser.id)
			await client.models.users.update({
					userID: discorduser.id,
                    username: args[1]
			}, {
				where: {				
					userID: discorduser.id
				}
			})
			await message.reply(discorduser.username+"'s last.fm username was set to "+args[1]+".")
		}
    }

}

module.exports = UsernameCommand