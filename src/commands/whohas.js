const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class WhoHasCommand extends Command {

    constructor() {
        super({
            name: 'whohas',
            description: 'Shows you who has the crown for a given artist. ' +
            'If no artist is defined, the bot will try to look up the artist you are ' +
            'currently listening to.',
            usage: [
                'whohas', 
                'whohas <artist name>'
            ],
            aliases: ['wh']
        })
    }

    async run(client, message, args) {
		const { bans, users, crowns } = client.models
		const user = await users.findOne({
            where: {
                userID: message.author.id
            }
        })
        let artistName
        if (args.length === 0) {
            const params = stringify({
                method: 'user.getrecenttracks',
                user: user.username,
                api_key: client.apikey,
                format: 'json',
            })
            const data = await fetch(`${client.url}${params}`).then(r => r.json())
            if (data.error) {
                await message.reply('something went wrong with getting info from Last.fm.')
                console.error(data);
                return
            } else {
                const artist = data.recenttracks.track[0]
                if (artist[`@attr`] && artist[`@attr`].nowplaying) {
                    artistName = artist.artist[`#text`]
                }
				const paramsartistnormal = stringify({
					method: 'artist.getinfo',
					artist: artistName,
					api_key: client.apikey,
					format: 'json',
				})
				const dataartistnormal = await fetch(`${client.url}${paramsartistnormal}`).then(r => r.json())				
				artistName = dataartistnormal.artist.name				
            }
        } else {          
			const params = stringify({
                method: 'artist.getinfo',
                artist: args.join(` `),
                api_key: client.apikey,
                format: 'json',
            })
            const data = await fetch(`${client.url}${params}`).then(r => r.json())
			if (data.error === 6) {
				await message.reply('"'+args.join(` `)+'" does not appear to be a valid artist name.')
				return
			}
            if (data.error) {
                await message.reply("something went wrong with getting info from Last.fm.")
                console.error(data);
                return
            } else {
                artistName = data.artist.name
            }			
        }
		const allcrowns = await client.models.crowns.findAll({
            where: {
                guildID: message.guild.id,
                artistName: artistName
            }
        })		
		//const crowns=allcrowns.sort((a, b) => parseInt(b.artistPlays) - parseInt(a.artistPlays))		
        if (allcrowns.length > 0) {
			/*
            let num = 0
            const description = crowns.slice(0, 10)
                .sort((a, b) => parseInt(b.artistPlays) - parseInt(a.artistPlays))
                .map(x => `${++num}. ${x.artistName} - **${x.artistPlays}** plays`)
				.join('\n')
                + `\n\n${user.user.username} has **${crowns.length}** crowns in ${message.guild.name}.`
            const embed = new BotEmbed(message)
                .setTitle(`Crowns of ${user.user.tag} in ${message.guild.name}`)
                .setDescription(description)
                .setThumbnail(user.user.avatarURL)
            await message.channel.send(embed)
           */
		   try{
		   await message.reply('**'+ message.guild.members.cache.get(allcrowns[0].userID).user.username+'** has the crown for **' + artistName+'** with **'+ allcrowns[0].artistPlays + "** plays.")
		   }catch{
			   await message.reply('I cannot identify the owner of the crown for **'+artistName+'**. Maybe the user left the server.')
		   }
        } else {
            await message.reply('no one has the crown for **'+artistName+'**.')
        }
    }

}

module.exports = WhoHasCommand