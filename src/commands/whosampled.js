const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class WhoSampledCommand extends Command {

    constructor() {
        super({
            name: 'whosampled',
            description: 'Displays a link to whosampled.com search results for a specified artist/track. ' +
            'If no artist/track is specified, the bot will try to return a link to the corresponding artist/track ' +
            'of your last scrobbled track.',
            usage: [
                'whosampled',
				'whosampled <artist name>',
                'whosampled <artist name> | <track name>'
            ],
            aliases: ['ws']
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
				albumName = data.recenttracks.track[0].name
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
					method: 'track.getinfo',
					artist: artistName,
					track: albumName,
					api_key: client.apikey,
					format: 'json',
				})
				const data3 = await fetch(`${client.url}${params3}`).then(r => r.json())
				try{
					cover = data3.track.album.image[3]['#text']
					albumName = data3.track.name
					
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
				const url=(`https://www.whosampled.com/search/?${urlp}`)
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
						.setAuthor('\🔎 Who Sampled search for "'+tdisp+'"')
						.setThumbnail(cover)
						//.setThumbnail(checkuser.user.avatarURL)
					await message.channel.send(embed)

        } else {
            await message.reply('something went wrong. Sorry.')
        }
    }

}

module.exports = WhoSampledCommand