const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class CoverCommand extends Command {

    constructor() {
        super({
            name: 'cover',
            description: 'Displays the album cover of a specified album. ' +
            'If no artist/album is specified, the bot will try to display the album cover of ' +
            'of your last scrobbled track.',
            usage: [
                'cover', 
                'cover <artist name> | <album name>'
            ],
            aliases: ['co']
        })
    }

    async run(client, message, args) {
		const { bans, users, crowns } = client.models
		const user = await users.findOne({
            where: {
                userID: message.author.id
            }
        })
        let artistName=""
		let cover=""
		let albumName=""
		
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
				cover = data.recenttracks.track[0].image[3]['#text']
				albumName = data.recenttracks.track[0].album[`#text`]
                //if (artist[`@attr`] && artist[`@attr`].nowplaying) {
                    artistName = artist.artist[`#text`]
                //}
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
							return
						}
					}else{
						artistName = data.artist.name
					}
				}
			}
			//console.log(message.mentions.members.first().id)
			if(args.join(` `).split('|').length>1){
				
				albumName=args.join(` `).split('|')[1].trim()					
				console.log(albumName+" by "+artistName)
				const params3 = stringify({
					method: 'album.getinfo',
					artist: artistName,
					album: albumName,
					api_key: client.apikey,
					format: 'json',
				})
				const data3 = await fetch(`${client.url}${params3}`).then(r => r.json())
				try{
					cover = data3.album.image[3]['#text']
					albumName = data3.album.name
					
				}catch{
					await message.reply('I can\'t seem to find that cover. Check your spelling maybe?')
					return
				}
			}
        }
		//console.log("NAME: "+artistName)
		
        if (artistName.length > 0) {
			if(albumName.length>0){
				await message.channel.send(`Album cover for \`${artistName} - ${albumName}\``, { 
                    files: [cover] 
                });
			}else{
				await message.reply('you need to specify an album title.')
			}
        } else {
            await message.reply('something went wrong. Sorry.')
        }
    }

}

module.exports = CoverCommand