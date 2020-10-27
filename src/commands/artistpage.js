const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class ArtistPageCommand extends Command {

    constructor() {
        super({
            name: 'artistpage',
            description: 'Returns a link to the last.fm artist page for a given artist. ' +
            'If no artist is specified, the bot will try to look up the artist you are ' +
            'currently listening to.',
            usage: [
                'artistpage', 
                'artistpage <artist name>'
            ],
            aliases: ['apage','arp']
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
		let userplaycount
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
            }

			
        } else {
			 //Old Method
			const params = stringify({
                method: 'artist.getinfo',
                artist: args.join(` `),
                api_key: client.apikey,
                format: 'json',
            })
			const data = await fetch(`${client.url}${params}`).then(r => r.json())					
			/*
			if (data.error === 6) {
				await message.reply('"'+args.join(` `)+'" does not appear to be a valid artist name.')
				return
			}
			*/
            if ((data.error)&&(data.error!=6)) {
                await message.reply("something went wrong with getting info from Last.fm.")
                console.error(data);
                return
            } else {
				let checkurl=1
				try{
					checkurl=data.artist.url.indexOf('+noredirect')
				}catch{
				}
				if(checkurl!=-1){
					const params2 = stringify({
						method: 'artist.search',
						artist: args.join(` `),
						api_key: client.apikey,
						format: 'json',
					})
					const data2 = await fetch(`${client.url}${params2}`).then(r => r.json())					
					try{
						artistName = data2.results.artistmatches.artist[0].name
					}catch{
						await message.reply("\""+args.join(` `)+"\" does not appear to be a valid artist name.")
					}
				}else{
					artistName = data.artist.name
				}
            }		
        }
		//console.log("NAME: "+artistName)
		
        if (artistName.length > 0) {
			const params3 = stringify({
                method: 'artist.getinfo',
                artist: artistName,
                api_key: client.apikey,
                format: 'json',
            })
			const data3 = await fetch(`${client.url}${params3}`).then(r => r.json())
			userplaycount=parseInt(data3.artist.stats.userplaycount)
				let msg
				await message.reply("**"+artistName+"** on last.fm: "+data3.artist.url)            			
        } else {
            await message.reply('something went wrong. Sorry.')
        }
    }

}

module.exports = ArtistPageCommand