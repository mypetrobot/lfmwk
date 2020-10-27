const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')
const BotEmbed = require('../classes/BotEmbed')

class TaggedArtistsCommand extends Command {

    constructor() {
        super({
            name: 'taggedartists',
            description: 'Returns the artists in your overall top 1000 that also appear in the top 1000 artists for a specified tag.',
            usage: ['taggedartists <tag>'],		
			aliases: ['ta','tag']
        })
    }

    async run(client, message, args) {
		const { bans, users, crowns } = client.models
		const user = await users.findOne({
			where: {
				userID: message.author.id
			}
		})
		
		if(args.join(' ').length!=0){
			const params = stringify({
					method: 'tag.gettopartists',								
					tag: args.join(' '),
					api_key: client.apikey,
					format: 'json',
					limit:1000
				})
				const data = await fetch(`${client.url}${params}`).then(r => r.json())
				if (data.error) {
					await message.reply('something went wrong with getting info from Last.fm.')
					console.error(data);
					return
				} else {

					const params2 = stringify({
						method: 'user.gettopartists',                
						user: user.username,
						limit: 1000,						
						api_key: client.apikey,				
						format: 'json'
					})
					const data2 = await fetch(`${client.url}${params2}`).then(r => r.json())
					if (data2.error) {
						await message.reply('something went wrong with getting info from Last.fm.')
						console.error(data);
						return
					}
					const matches = [];
					for (const a of data2.topartists.artist) {
						const match = data.topartists.artist.find(x => x.name === a.name);
						if (match) {
						  const data = {
							name: match.name,
							authorPlays: a.playcount,
							userPlays: a.playcount							
						  };
						  matches.push(data);
						}
					}		
					if (matches.length === 0) {
						await message.reply(`none of your top artists are among the top 1000 tagged as **${args.join(' ')}**.`);
						return
					}
					const embed = new BotEmbed(message)
						.setTitle(`${user.username}'s top artists that are among the top 1000 artists tagged ${data.topartists['@attr'].tag}`)
						.setURL('http://www.last.fm/user/'+user.username)						
						//.setThumbnail(checkuser.user.avatarURL)
					const tastes=matches.slice(0, 15)
					for(let m=0;m<tastes.length;m++){				
						let apblurb="plays"
						let upblurb="plays"
						if(parseInt(tastes[m].authorPlays)==1){apblurb="play"}												
						const comp = `${tastes[m].authorPlays} ${apblurb}`;
						embed.addField(`${tastes[m].name}`, comp, true);				
					}					
					await message.channel.send(embed)
				}
		}else{
			await message.reply('you must specify a genre/tag for me to look up.')
		}
    }

}

module.exports = TaggedArtistsCommand