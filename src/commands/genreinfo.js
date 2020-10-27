const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')
const BotEmbed = require('../classes/BotEmbed')

class GenreInfoCommand extends Command {

    constructor() {
        super({
            name: 'genreinfo',
            description: 'Returns some information about a specified genre/tag.',
            usage: ['genreinfo <tag>'],		
			aliases: ['gi']
        })
    }

    async run(client, message, args) {
		if(args.join(' ').length!=0){
			const params = stringify({
					method: 'tag.getinfo',								
					tag: args.join(' '),
					api_key: client.apikey,
					format: 'json',
				})
				const data = await fetch(`${client.url}${params}`).then(r => r.json())
				if (data.error) {
					await message.reply('something went wrong with getting info from Last.fm.')
					console.error(data);
					return
				} else {
					let { content } = data.tag.wiki;   
					content = content.replace(/(<([^>]+)>)/ig,"");
					content = content.replace('Read more on Last.fm. User-contributed text is available under the Creative Commons By-SA License; additional terms may apply.','')
					if(content.length>2048){
						content=content.substring(0, 2044)
						content+="..."
					}
					const embed = new BotEmbed(message)
						.setTitle(`Genre Info: ${data.tag.name}`)					
						.addField(`Uses`, data.tag.total, true)
						.addField(`Listeners `, data.tag.reach, true);					
						//.setThumbnail(checkuser.user.avatarURL)
					if (/ +/gi.test(content)) {
						embed.setDescription(content)			
					}
					await message.channel.send(embed)
				}
		}else{
			await message.reply('you must specify a genre/tag for me to look up.')
		}
    }

}

module.exports = GenreInfoCommand