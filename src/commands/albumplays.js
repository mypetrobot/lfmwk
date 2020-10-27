const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class AlbumPlaysCommand extends Command {

    constructor() {
        super({
            name: 'albumplays',
            description: 'Shows the playcount for a given album. ' +
            'If no artist/album are specified, the bot will try to look up the album you are ' +
            'currently listening to.',
            usage: [
                'albumplays', 
                'albumplays <artist name> | <album name>',
				'albumplays | @<username>', 
                'albumplays <artist name> | <album name> | @<username>'				
            ],
            aliases: ['ap']
        })
    }

    async run(client, message, args) {
		const { bans, users, crowns } = client.models
		let user = await users.findOne({
            where: {
                userID: message.author.id
            }
        })
        let artistName
		let trackName=""
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
					trackName = artist.album[`#text`]
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
						trackName = artist.album[`#text`]
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
			if(message.mentions.members.first()){				
				user = await users.findOne({
					where: {
						userID: message.mentions.members.first().id
					}
				})
			}
        }		
		//console.log(artistName+" / "+user.username)
		try{
			let testdata=artistName.length
		}catch{
			await message.reply('I ran into some trouble getting your playcount, sorry.')
			return
		}
        if (artistName.length > 0) {
			if(trackName==""){
				if(args.join(` `).split('|').length>=2){
					trackName=args.join(` `).split('|')[1].trim()
				}
			}
			//console.log(artistName+" - "+trackName)
			try{
				let testuser=user.username
			}catch{
				await message.reply('that user does not appear to have a last.fm profile setup with me.')
				return
			}
				const params3 = stringify({
					method: 'album.getInfo',
					artist: artistName,
					album: trackName,
					user: user.username,
					api_key: client.apikey,
					format: 'json',
				})			
			const data3 = await fetch(`${client.url}${params3}`).then(r => r.json())
			try{
				userplaycount=parseInt(data3.album.userplaycount)
			}catch{
				await message.reply('"'+trackName+'" does not appear to be a valid album by **'+artistName+'**.')
				return
			}
				let msg
				if(userplaycount>0){
					if(args.join(` `).split('|').length>1){
						//msg=user.username+" has scrobbled **"+artistName+"** **"+userplaycount+"** time"
						msg=user.username+" has **"+userplaycount+"** scrobble"
						if(userplaycount>1){
							msg+="s"
						}
						msg+=" of **"+trackName+"** by **"+artistName+"**."
					}else{
						msg="you have **"+userplaycount+"** scrobble"
						if(userplaycount>1){
							msg+="s"
						}
						msg+=" of **"+trackName+"** by **"+artistName+"**."
					}
				}else{
					if(args.join(` `).split('|').length>1){
						msg=user.username+" hasn't scrobbled **"+trackName+"** by **"+artistName+"**."
					}else{
						msg="you haven't scrobbled **"+trackName+"** by **"+artistName+"**."
					}
				}
				await message.reply(msg)            			
        } else {
            await message.reply('something went wrong. Sorry.')
        }
    }

}

module.exports = AlbumPlaysCommand