const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const fs = require('fs')
const path = require('path')

function plur(str,num){if(num!=1){return str+"s"}else{return str}}

class CrownsCommand extends Command {

    constructor() {
        super({
            name: 'crowns',
            description: 'Shows you your crowns, crowns in this server, ' +
            'bans/unbans people from having crowns and resets people\'s crowns.',
            usage: [
                'crowns', 
                'crowns ban <user>', 
                'crowns guild',
				'crowns rank',
                'crowns <user>',
				'crowns me <user>',
				'crowns over <amount> <user>',
				'crowns under <amount> <user>',
				'crowns equal <amount> <user>',
                'crowns unban <user>', 
                'crowns reset <user>',				
				'crowns optout'
            ],
            aliases: ['cw']
        })
    }

    async run(client, message, args) {
		const { bans, users } = client.models
        const files = fs.readdirSync(path.join(__dirname, 'crowns'))
        const cmds = files.map(x => x.slice(0, x.length - 3))
        let user
        if (args.length > 0) {
            if (cmds.includes(args[0])) {
                const command = require(`./crowns/${args[0]}`)
                await command.run(client, message, args.slice(1))
                return
            } else {
                user = message.mentions.members.first()
            }
        } else {
            user = message.member
        }
		const allcrowns = await client.models.crowns.findAll({
            where: {
                guildID: message.guild.id,
                userID: user.id
            }
        })
		const lfmuser = await users.findOne({
				where: {
					userID: user.id
				}
			})
		const crowns=allcrowns.sort((a, b) => parseInt(b.artistPlays) - parseInt(a.artistPlays))
        if (crowns.length > 0) {
            let num = 0
            const description = crowns.slice(0, 10)
                .sort((a, b) => parseInt(b.artistPlays) - parseInt(a.artistPlays))
                .map(x => `${++num}. ${x.artistName} - **${x.artistPlays}** plays`)
				.join('\n')
                + `\n\n${user.user.username} has **${crowns.length}** ${plur('crown',crowns.length)} in ${message.guild.name}.`
            const embed = new BotEmbed(message)
                .setTitle(`${user.user.username}'s crowns in ${message.guild.name}`)
                .setDescription(description)
                .setThumbnail(user.user.avatarURL)
				.setURL("https://www.last.fm/user/"+lfmuser.username)
            await message.channel.send(embed)
            
        } else {
            await message.reply(`${user.user.username} does not have any crowns in this server.`)
        }
    }

}

module.exports = CrownsCommand