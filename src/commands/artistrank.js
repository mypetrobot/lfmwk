const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class ArtistRankCommand extends Command {

    constructor() {
        super({
            name: 'artistrank',
            description: 'Shows the rank of a given artist for the user\'s overall time period. ' +
            'If no artist is defined, the bot will try to look up the artist you are ' +
            'currently listening to.',
            usage: [
                'artistrank', 
                'artistrank <artist name>'
            ],
            aliases: ['ar']
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
			const params2 = stringify({
                method: 'user.gettopartists',                
				user: user.username,
				limit: 1000,
                api_key: client.apikey,
                format: 'json',
            })
            const data2 = await fetch(`${client.url}${params2}`).then(r => r.json())
            if (data2.error) {
                await message.reply("something went wrong with getting info from Last.fm.")
                console.error(data2);
                return
            } else {
				let rank=-1
				let userplaycount=0
				for (let z=0;z<data2.topartists.artist.length;z++){
					if(data2.topartists.artist[z].name.toLowerCase()==artistName.toLowerCase()){
						rank=z+1
						userplaycount=data2.topartists.artist[z].playcount
					}
				}
				if(rank!=-1){
					await message.reply("**"+artistName+"** is ranked **#"+rank+"** on your all-time top artists list with **"+userplaycount+"** plays.")
				}else{
					await message.reply("**"+artistName+"** was not found in your top 1000 artists.")
				}
            }				
        } else {
            await message.reply('something went wrong. Sorry.')
        }
    }

}

module.exports = ArtistRankCommand