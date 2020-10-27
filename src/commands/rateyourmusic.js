const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class RateYourMusicCommand extends Command {

    constructor() {
        super({
            name: 'rateyourmusic',
            description: 'Displays google rateyourmusic.com search result links to a specified artist/album. ' +
            'If no artist/album is specified, the bot will try to return links to the corresponding artist/album ' +
            'of your last scrobbled track.',
            usage: [
                'rateyourmusic',
				'rateyourmusic <artist name>',
                'rateyourmusic <artist name> | <album name>'
            ],
            aliases: ['ryms','rate']
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
				//console.log(albumName+" by "+artistName)
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
					albumName=""
				}
			}
        }
		//console.log("NAME: "+artistName)
		
        if (artistName.length > 0) {
				const urlp = stringify({
					q: artistName+" "+albumName
				})
				const url=(`https://www.google.com/search?${urlp}+site%3Arateyourmusic.com`)
				//await message.channel.send(`Album cover for \`${artistName} - ${albumName}\`: ${url}`)
					let tdisp=artistName
					try{
						if(albumName.length>0){
							tdisp+=(" - "+albumName)
						}
					}catch{}					
					const embed = new BotEmbed(message)
						.setTitle(`Click here to view the results`)						
						.setURL(url)
						.setAuthor('\🔎 RYM search for "'+tdisp+'"')
						.setThumbnail(cover)
						//.setThumbnail(checkuser.user.avatarURL)
					await message.channel.send(embed)

        } else {
            await message.reply('something went wrong. Sorry.')
        }
    }

}

module.exports = RateYourMusicCommand