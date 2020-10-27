const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class WhoStansCommand extends Command {

    constructor() {
        super({
            name: 'whostans',
            description: 'Shows you who has the crown for a given artist and gives the overall rank of that crown. ' +
            'If no artist is defined, the bot will try to look up the artist you are ' +
            'currently listening to.',
            usage: [
                'whostans', 
                'whostans <artist name>'
            ],
            aliases: ['wst','whs']
        })
    }

    async run(client, message, args) {
		const { bans, users } = client.models
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
		const crownowner = await client.models.crowns.findAll({
            where: {
                guildID: message.guild.id,
                artistName: artistName
            }
        })
		if(crownowner.length<1){
			await message.reply('no one has the crown for **'+artistName+'**.')
			return
		}
		const allcrowns = await client.models.crowns.findAll({
            where: {
                guildID: message.guild.id
            }
        })		
		const crowns=allcrowns.sort((a, b) => parseInt(b.artistPlays) - parseInt(a.artistPlays))		
		let therank=-1;
        if (allcrowns.length > 0) {
			for(let i=0;i<crowns.length;i++){
				if(crowns[i].artistName==artistName){
					therank=i+1
					break
				}
			}
		   try{
		   await message.reply('**'+ message.guild.members.cache.get(crownowner[0].userID).user.username+'** has the crown for **' + artistName+'**, ranked **#'+therank+'** with **'+ crownowner[0].artistPlays + "** plays.")
		   }catch{
			   await message.reply('I cannot identify the owner of the crown for **'+artistName+'**. Maybe the user left the server.')
		   }
        } else {
            await message.reply('something went wrong.')
        }
    }

}

module.exports = WhoStansCommand