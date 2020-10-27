const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')

class HelpCommand extends Command {

    constructor() {
        super({
            name: 'help',
            description: 'Displays information about a specified command. If no command is specified, the bot will display a general help message.',
            usage: ['help', 'help <command>'],
            aliases: ['h']
        })
    }

    async run(client, message, args) {
        if (args[0]) {
            const command = client.commands.find(x => x.name === args[0] || x.aliases.includes(args[0]))
            if (command) {
                const info = 
                `**Description:** ${command.description}\n\n` + 
                `**Usage:**\n ${command.usage.map(x => ``+'`'+`${client.prefix}${x}`+'`').join('\n')}\n\n` +
                `**Shortcuts:** ${command.aliases.length !== 0 ? command.aliases.join(', ') : 'none'}`
                if (!command.hidden) {
                    //await message.channel.send(info)
					const embed = new BotEmbed(message)						
						//.setAuthor(playmsg+user.username, message.author.avatarURL, 'https://www.last.fm/user/'+user.username)
						.setTitle(`Help: ${command.name}\n`)
						.setDescription(info)
						//.addField(user.username+" has scrobbled "+artistName+" "+userplaycount+" time(s)", ' ')
						//.setThumbnail(data.recenttracks.track[0].image[2][`#text`])
						//.setFooter(tags.join(' ∙ ')+"\n"+info.join(' ∙ '))
						//.setTimestamp(' ')
						//.setURL(data.recenttracks.track[0].url)
					await message.channel.send(embed)		
                }
            } else {
                await message.reply(`no command under the name of ${args[0]} found.`)
            }
        } else {
            const info = "**Here is a list of available commands:**\n"+client.commands
                .filter(x => !x.hidden)
                //.map(x => `**${client.prefix}${x.name}**${x.aliases.length !== 0 ? ' *(' + x.aliases.join(', ') + ')*' : ''}: ${x.description}`)
				//.map(x => '`'+`${x.name}`+'`'+`${x.aliases.length !== 0 ? ' (' + x.aliases.join(', ') + ')' : ''}`)
				.map(x => '`'+`${x.name}`+'`')
                .join(', ') + `\n\n *To execute a command, please use* `+'`'+`${client.prefix}`+'`'+` *as a prefix.* \n**For example:**\n`
				+ '> `'+`${client.prefix}`+'help <command>` displays additional information about the specified command.'
				//+ `**Type ${client.prefix}help <command> for more information on the specified command.**`
            //await message.channel.send(info)
					const embed = new BotEmbed(message)						
						//.setAuthor(playmsg+user.username, message.author.avatarURL, 'https://www.last.fm/user/'+user.username)
						.setTitle("Help")
						.setDescription(info)
						//.addField(user.username+" has scrobbled "+artistName+" "+userplaycount+" time(s)", ' ')
						//.setThumbnail(data.recenttracks.track[0].image[2][`#text`])
						//.setFooter(tags.join(' ∙ ')+"\n"+info.join(' ∙ '))
						//.setTimestamp(' ')
						//.setURL(data.recenttracks.track[0].url)
					await message.channel.send(embed)			
        }
    }

}

module.exports = HelpCommand