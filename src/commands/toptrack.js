const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class TopTrackCommand extends Command {

    constructor() {
        super({
            name: 'toptrack',
            description: 'Shows the title of the top track for a given artist. ' +
            'If no artist is defined, the bot will try to look up the artist you are ' +
            'currently listening to.',
            usage: [
                'toptrack', 
                'toptrack <artist name>',
				'toptrack | <rank #>', 
                'toptrack <artist name> | <rank #>'
            ],
            aliases: ['tt']
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
		let checktrack=1
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
			const checkartist=args.join(` `).split('|')[0].trim()
			if(checkartist==""){
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
			}else{
				 //Old Method
				const params = stringify({
					method: 'artist.getinfo',
					artist: checkartist,
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
							artist: checkartist,
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
			try{
				checktrack=parseInt(args.join(` `).split('|')[1].trim())
			}catch{
				checktrack=1
			}
        }
		//console.log("NAME: "+artistName)
		
        if (artistName.length > 0) {
			if((checktrack<1)||(checktrack>2000)||(Number.isNaN(checktrack))){
				await message.reply("this is not going to do what you think it's going to do.")                
                return
			}
			const params2 = stringify({
                method: 'artist.gettoptracks',                
				artist: artistName,
				limit: checktrack,
                api_key: client.apikey,
                format: 'json',
            })
            const data2 = await fetch(`${client.url}${params2}`).then(r => r.json())
            if (data2.error) {
                await message.reply("something went wrong with getting info from Last.fm.")
                console.error(data2);
                return
            } else {
				try{
					let toptr=data2.toptracks.track[checktrack-1].name
					await message.reply("the **#"+checktrack+"** most scrobbled track by all users on Last.fm for **"+artistName+"** is *\""+toptr+"\"*.")
				}catch{
					await message.reply("**"+artistName+"** does not appear to have a top track at position **#"+checktrack+"**.")
				}
            }				
        } else {
            await message.reply('something went wrong. Sorry.')
        }
    }

}

module.exports = TopTrackCommand