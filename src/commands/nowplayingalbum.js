const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class NowPlayingAlbumCommand extends Command {

    constructor() {
        super({
            name: 'nowplayingalbum',
            description: 'Shows the track you\'re currently playing. ',            
            usage: [
                'nowplayingalbum'
            ],
            aliases: ['npa','npl','fma','fml']
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
			let playmsg="Last Scrobbled - "
            if (artist[`@attr`] && artist[`@attr`].nowplaying) {
				playmsg="Now Playing - "
			}
				artistName = artist.artist[`#text`]				
				const params3 = stringify({
					method: 'album.getinfo',
					album: artist.album[`#text`],
					artist: artistName,
					user: user.username,
					api_key: client.apikey,
					format: 'json',
				})
				const data3 = await fetch(`${client.url}${params3}`).then(r => r.json())
				let tags=[]
				try{
					userplaycount=parseInt(data3.album.userplaycount)
					artistName=data3.album.artist
					let pretag=[]
					let badtags = [
						'seen live'
					]
					badtags.push(artistName.replace("-", " ").toLowerCase())
					for(let i=0;i<data3.album.tags.tag.length;i++){
						if(data3.album.tags.tag[i].name.length<20){
							const matches = data3.album.tags.tag[i].name.match(/\d+/g);
							if (matches != null) {							
							}else{
								pretag.push(data3.album.tags.tag[i].name.replace("-", " ").toLowerCase())
							}
						}
					}
					let unique = [...new Set(pretag)]				
					tags=unique.filter(function(x) { 
					//const tags=[...new Set(pretag.filter(function(x) { 
						return badtags.indexOf(x) < 0;
					});					
				}catch{
					userplaycount="?"					
				}
				let rsb=false
				if((tags.includes("rare sad boy"))||(tags.includes("rare sad girl"))||(tags.includes("rare sads"))){
					rsb=true
				}
				tags=tags.slice(0, 5)
				let info=[]
				if(userplaycount=="?"){
					info.push("No data for "+data.recenttracks.track[0].album[`#text`]+" on last.fm")
				}else{
					if(userplaycount!=1){
						info.push(""+userplaycount+" scrobbles of this album")
					}else{
						info.push(""+userplaycount+" scrobble of this album")
					}
				}
				info.push(data.recenttracks['@attr'].total+" total scrobbles")
				const allcrowns = await client.models.crowns.findAll({
				where: {
					guildID: message.guild.id,
					artistName: artistName
					}
				})		
				if (allcrowns.length > 0) {
				   //info.push('**'+ message.guild.members.cache.get(allcrowns[0].userID).user.username+'** has the crown for **' + artistName+'** with **'+ allcrowns[0].artistPlays + "")
					if(allcrowns[0].userID==message.author.id){
						info.unshift('👑')
					}else{
						try{
						info.push('👑 '+ allcrowns[0].artistPlays + " ("+ message.guild.members.cache.get(allcrowns[0].userID).user.username+")")
						}catch{}
					}
				} else {
					//await message.reply('no one has the crown for **'+artistName+'**.')
				}				
					let msg="By **"+artistName+"**"
					if(data.recenttracks.track[0].album[`#text`]!=""){
						if((data.recenttracks.track[0].album[`#text`].indexOf('(')==-1)&&(data.recenttracks.track[0].album[`#text`].indexOf(')')==-1)&&(data3.album.url.indexOf('(')==-1)&&(data3.album.url.indexOf(')')==-1)){
							msg=msg+" from *["+data.recenttracks.track[0].album[`#text`]+"]("+data3.album.url+")*"							
						}else{
							msg=msg+" from *"+data.recenttracks.track[0].album[`#text`]+"*"
						}						
						
						
					}
					const embed = new BotEmbed(message)
						
						.setAuthor(playmsg+user.username, message.author.avatarURL, 'https://www.last.fm/user/'+user.username)
						.setTitle(data.recenttracks.track[0].name)
						.setDescription(msg)
						//.addField(user.username+" has scrobbled "+artistName+" "+userplaycount+" time(s)", ' ')
						.setThumbnail(data.recenttracks.track[0].image[2][`#text`])
						.setFooter(tags.join(' ∙ ')+"\n"+info.join(' ∙ '))
						.setTimestamp(' ')
						.setURL(data.recenttracks.track[0].url)
					const msgs = await message.channel.send(embed)
					if(rsb){
						/*await msgs.react('🇷')
						await msgs.react('🇸')
						await msgs.react('🇧')*/
						await msgs.react('😭')
					}
					
            /*}else{
				await message.reply('it doesn\'t seem like you\'re playing anything right now.')
			}*/
        }
	}

}

module.exports = NowPlayingAlbumCommand