const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class ComboCommand extends Command {

    constructor() {
        super({
            name: 'combo',
            description: 'Displays some information about current/active repeat listening habits for a given user. ' +
            'If no user is specified, the bot will default to you. ',
            usage: [
                'combo',
				'combo @<username>'                 
            ],
            aliases: ['streak','streaks']
        })
    }

    async run(client, message, args) {
		const { bans, users, crowns } = client.models
		let user
		let dispava
        if (args.length === 0) {
			user = await users.findOne({
				where: {
					userID: message.author.id
				}
			})
			dispava=message.author.avatarURL
        } else {
			user = await users.findOne({
				where: {
					userID: message.mentions.members.first().id
				}
			})
			dispava=message.mentions.members.first().user.avatarURL
        }		
		
		try{
			let testuser=user.username
		}catch{
			await message.reply('the user you requested probably doesn\'t have a last.fm account setup with me.')
			return
		}
		try{
			const params = stringify({
				method: 'user.getrecenttracks',
				user: user.username,
				limit: 1000,
				extended: 1,
				api_key: client.apikey,
				format: 'json',
			})
			const data = await fetch(`${client.url}${params}`).then(r => r.json())
			if (data.error) {
				await message.reply('something went wrong with getting info from Last.fm.')
				console.error(data);
				return
			} else {
				let artiststreak=1
				let songstreak=1
				let albumstreak=1
				let hmsg=""	
				let snp=""
				let anp=""
				let alnp=""
				if (data.recenttracks.track[0][`@attr`] && data.recenttracks.track[0][`@attr`].nowplaying) {
					artiststreak=0.5
					songstreak=0.5
					albumstreak=0.5
					snp="*"
					anp="*"
					alnp="*"
					//hmsg="\n\n***Note:** Half plays indicate a track currently playing, but not yet scrobbled.*"					
				}				
				
				const artist=data.recenttracks.track[0].artist.name
				const album=data.recenttracks.track[0].album[`#text`]
				const song=data.recenttracks.track[0].name				
				let activeartist=true
				let activesong=true
				let activealbum=true
				for(let i=1;i<data.recenttracks.track.length;i++){
					if(activeartist){
						if(data.recenttracks.track[i].artist.name==artist){
							artiststreak++
						}else{
							activeartist=false;
						}
					}
					if(activesong){
						if(data.recenttracks.track[i].name==song){
							songstreak++
						}else{
							activesong=false;
						}
					}
					if(activealbum){
						if(data.recenttracks.track[i].album[`#text`]==album){
							albumstreak++
						}else{
							activealbum=false;
						}
					}					
				}				
				let playmsg="Last Scrobbled - "

				//console.log(artist + ": " + artiststreak + " | " + song + ": " + songstreak)
				let songplay="play"
				let artistplay="play"
				let albumplay="play"
				
				if((songstreak!=1)&&(songstreak!=1.5)){
					songplay+="s in a row"
				}
				if((artiststreak!=1)&&(artiststreak!=1.5)){
					artistplay+="s in a row"
				}				
				if((albumstreak!=1)&&(albumstreak!=1.5)){
					albumplay+="s in a row"
				}

				let dispartist=artist
				try{
					if((artist.indexOf("(")==-1)&&(artist.indexOf(")")==-1)&&(artist.indexOf("[")==-1)&&(artist.indexOf("]")==-1)){
						dispartist="["+artist+"]("+data.recenttracks.track[0].artist.url+")"
					}
				}catch{}
				let disptrack=song
				try{
					if((song.indexOf("(")==-1)&&(song.indexOf(")")==-1)&&(song.indexOf("[")==-1)&&(song.indexOf("]")==-1)){
						disptrack="["+song+"]("+data.recenttracks.track[0].url+")"
					}
				}catch{}
				const params2 = stringify({
					method: 'album.getinfo',
					user: user.username,
					artist: artist,
					album: album,
					api_key: client.apikey,
					format: 'json',
				})
				const data2 = await fetch(`${client.url}${params2}`).then(r => r.json())				
				let dispalbum=album
				try{
					if((album.indexOf("(")==-1)&&(album.indexOf(")")==-1)&&(album.indexOf("[")==-1)&&(album.indexOf("]")==-1)){
						dispalbum="["+album+"]("+data2.album.url+")"
					}
				}catch{}
				let msg=""
				if(artiststreak>1){
					msg+="**Artist:** "+parseInt(artiststreak)+ anp + " " + artistplay + " - "+ dispartist +""
				}
				if(albumstreak>1){
					msg+="\n**Album:** "+parseInt(albumstreak)+ alnp + " " + albumplay + " - "+ dispalbum +""
				}
				if(songstreak>1){
					msg+="\n**Song:** "+parseInt(songstreak)+ snp + " " + songplay + " - "+ disptrack +""
				}
				if((artiststreak<1.5)&&(songstreak<1.5)&&(albumstreak<1.5)){
					msg="*(No consecutive plays found)*"
				}
				

				
				const embed = new BotEmbed(message)						
						.setAuthor("Active Listening Streaks for "+user.username, dispava, 'https://www.last.fm/user/'+user.username)
						//.setTitle(data.recenttracks.track[0].name)
						.setDescription(msg+hmsg)
						//.addField(user.username+" has scrobbled "+artistName+" "+userplaycount+" time(s)", ' ')
						//.setThumbnail(data.recenttracks.track[0].image[2][`#text`])
						.setThumbnail(dispava)
						//.setFooter(tags.join(' · ')+"\n"+info.join(' · '))
						//.setTimestamp(' ')
						//.setURL(data.recenttracks.track[0].url)
					await message.channel.send(embed)	
				
			}
		}catch{
			await message.reply('something went wrong, sorry.')
		}
    }

}

module.exports = ComboCommand