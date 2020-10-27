const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class ArtistPercentCommand extends Command {

    constructor() {
        super({
            name: 'artistpercent',
            description: 'Shows the percentage of your total playcount a given artist occupies. ' +
            'If no artist is specified, the bot will try to look up the artist you are ' +
            'currently listening to.',
            usage: [
                'artistpercent', 
                'artistpercent <artist name>',
				'artistpercent | @<username>', 
                'artistpercent <artist name> | @<username>'				
            ],
            aliases: ['apct']
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
			try{
				let testuser=user.username
			}catch{
				await message.reply('that user does not appear to have a last.fm profile setup with me.')
				return
			}
				const params3 = stringify({
					method: 'artist.getinfo',
					artist: artistName,
					user: user.username,
					api_key: client.apikey,
					format: 'json',
				})			
			const data3 = await fetch(`${client.url}${params3}`).then(r => r.json())
			
			userplaycount=parseInt(data3.artist.stats.userplaycount)
			
			const params4 = stringify({
					method: 'user.getinfo',
					user: user.username,
					api_key: client.apikey,
					format: 'json',
				})			
			const data4 = await fetch(`${client.url}${params4}`).then(r => r.json())			
			
			const usertotalcount=parseInt(data4.user.playcount)
			
			const pct=Math.round(((userplaycount/usertotalcount)*100)*100)/100
			
				let msg
				if(userplaycount>0){
					if(args.join(` `).split('|').length>1){
						//msg=user.username+" has scrobbled **"+artistName+"** **"+userplaycount+"** time"
						msg="**"+artistName+"** represents **"+pct+"%** of "+user.username+"'s total scrobbles."
					}else{
						msg="**"+artistName+"** represents **"+pct+"%** of your total scrobbles."
					}
				}else{
					if(args.join(` `).split('|').length>1){
						msg=user.username+" hasn't scrobbled **"+artistName+"**."
					}else{
						msg="you haven't scrobbled **"+artistName+"**."
					}
				}
				await message.reply(msg)            			
        } else {
            await message.reply('something went wrong. Sorry.')
        }
    }

}

module.exports = ArtistPercentCommand