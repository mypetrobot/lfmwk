const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')
const BotEmbed = require('../classes/BotEmbed')
const CrownThreshold = 30
const theftrole='726682412557271051'
//const theftrole='705445228588302420' //for test

function plur(str,num){if(num!=1){return str+"s"}else{return str}}

class WhoKnowsCommand extends Command {
    
    constructor() {
        super({
            name: 'crowncheck',
            description: 'Determines if you or another user will own the crown for an artist. ' +
            'If no artist is defined, the bot will try to look up an artist you are ' +
            'currently listening to.',
            usage: ['crowncheck', 'crowncheck <artist name>'],
            aliases: ['cc','c','w','wk']
        })
    }

    async run(client, message, args) {
		if(message.author.id!=client.ownerID){
			await message.reply('crowns are temporarily disabled. Sorry.')
			return
		}
		
		if((message.channel.id!="260438376270921729")){
			const { bans, users, crowns } = client.models
			const user = await users.findOne({
				where: {
					userID: message.author.id
				}
			})			
			let artistName
			let fullscan=false
			
			if (args.length === 0) {
				let paramsa2
				try{
					paramsa2 = stringify({
						method: 'user.getrecenttracks',
						user: user.username,
						api_key: client.apikey,
						format: 'json',
					})
				}catch{					
					await message.react('❌')
					await message.reply('you need to setup your last.fm account with me first.')
					return
				}
				
				const dataa2 = await fetch(`${client.url}${paramsa2}`).then(r => r.json())
				if (dataa2.error) {
					await message.reply('something went wrong with getting info from Last.fm.')
					console.error(dataa2);
					return
				} else {
					const artist = dataa2.recenttracks.track[0]
					if (artist[`@attr`] && artist[`@attr`].nowplaying) {
						artistName = artist.artist[`#text`]					
						const paramsa3 = stringify({
							method: 'artist.getinfo',
							artist: artistName,
							api_key: client.apikey,
							format: 'json',
						})
						const dataa3 = await fetch(`${client.url}${paramsa3}`).then(r => r.json())
						if (dataa3.error === 6) {
							await message.reply('"'+args.join(` `)+'" does not appear to be a valid artist name.')
							return
						}
						if (dataa3.error) {
							await message.reply("something went wrong with getting info from Last.fm.")
							console.error(dataa3);
							return
						} else {
							artistName = dataa3.artist.name
						}					
					}else{
						await message.reply("you don't appear to be currently scrobbling anything.")
						return
					}
				}
			} else {
				const paramsa2 = stringify({
					method: 'artist.getinfo',
					artist: args.join(` `),
					api_key: client.apikey,
					format: 'json',
				})
				const dataa2 = await fetch(`${client.url}${paramsa2}`).then(r => r.json())
				if (dataa2.error === 8) {
					await message.reply('Last.fm is having problems right now, try again later')
					return
				}
				if (dataa2.error === 6) {
					await message.reply('"'+args.join(` `)+'" does not appear to be a valid artist name.')
					return
				}
				if (dataa2.error) {
					await message.reply("something went wrong with getting info from Last.fm.")
					console.error(dataa2);
					return
				} else {
					artistName = dataa2.artist.name
				}
			}
			
			await message.react('✅')
			
			//if( message.guild.members.cache.get(message.author.id).roles.get(theftrole)){
			if(message.member.roles.cache.has(theftrole)){
				await message.reply("You are currently marked as inactive on Last.fm Discord. This role is usually set after one month of inactivity on the server. If you are returning to activity please post in #role-request to ask for the role to be removed before running crown scans. Welcome back!")
				await message.react('❌')
				return
			}
			
			const allcrowns = await client.models.crowns.findAll({
				where: {
					guildID: message.guild.id,
					artistName: artistName
				}
			})
			/* CHECKING IF CROWN-HOLDER HAS LEFT IS BROKEN
			if (allcrowns.length > 0) {	
			   try{
			   //await message.reply('**'+ message.guild.members.cache.get(allcrowns[0].userID).user.username+'** has the crown for **' + artistName+'** with **'+ allcrowns[0].artistPlays + "** plays.")
					let testing= message.guild.members.cache.get(allcrowns[0].userID).user.username
					
					// Need to check if user has a valid lfm account.
					
			   }catch(e){
				   console.log(e)
				   //await message.reply('I cannot identify the owner of the crown for **'+artistName+'**. Maybe the user left the server.')
					const killamount = await crowns.destroy({
						where: {
							guildID: message.guild.id,
							artistName: artistName
						}
					})					
				   fullscan=true
			   }
			  
			} else {				
				fullscan=true
			}
			*/
			let crownuser
			let crowndata
			if(!fullscan){
				crownuser = await users.findOne({
					where: {
						userID: allcrowns[0].userID
					}
				})
				const paramscrown = stringify({
							method: 'artist.getinfo',
							artist: artistName,
							username: crownuser.username,
							api_key: client.apikey,
							format: 'json'
						})
				crowndata = await fetch(`${client.url}${paramscrown}`).then(r => r.json())
				if (crowndata.error === 8) {
					await message.reply('Last.fm is having problems right now, try again later')
					return
				}				
				console.log("Cur: "+parseInt(crowndata.artist.stats.userplaycount))
				if((isNaN(parseInt(crowndata.artist.stats.userplaycount)))||(parseInt(crowndata.artist.stats.userplaycount)<CrownThreshold)){
					fullscan=true
					const amount = await crowns.destroy({
						where: {
							guildID: message.guild.id,
							artistName: artistName
						}
					})					
				}
			}
			
			const checkbannedartist = await bans.findOne({
					where: {
						guildID: 'bannedartist',
						userID: artistName,						
					}
				})
			if(checkbannedartist){
				await message.reply('it is not possible to get the crown for **'+artistName+'**. This is usually because it is a misspelling or bootleg artist, please check and scan the correct artist name.')
				await message.react('❌')
				return
			}
			
			// Fullscan here
			/*if(fullscan){
				
				if((message.channel.id!=client.whoknowschannel)&&(client.whoknowschannel!="")&&(message.channel.id!="628055156071858189")){
					await message.reply("I need to scan all users in order to award the crown for **"+artistName+"**. Please run this command in "+client.channels.get('629500369109516298')+".")
					await message.react('❌')
					return
				}
				await message.reply("I need to scan all users in order to award the crown for **"+artistName+"**. I'll ping you when I'm done.")
				const params = stringify({
					method: 'artist.getinfo',
					artist: artistName,
					api_key: client.apikey,
					format: 'json'
				})
				const data = await fetch(`${client.url}${params}`).then(r => r.json())
				if (data.error === 6) {
					await message.reply(`no artist named ${artistName} found.`)
					return
				} else {
					const guild = await message.guild.fetchMembers()
					let know = []
					for (const [id, member] of guild.members) {
						const user = await users.findOne({
							where: {
								userID: id
							}
						})
						if (!user) {
							continue
						}
						const params = stringify({
							method: 'artist.getinfo',
							artist: artistName,
							username: user.username,
							api_key: client.apikey,
							format: 'json'
						})
						const data = await fetch(`${client.url}${params}`).then(r => r.json())
						if (data.error === 6) {
							console.log("Invalid lfm name for: "+user.userid+" ("+user.username+")")
							console.log("test")
						}
						if (data.error) {						
							continue
						}
						if ((data.artist.stats.userplaycount !== '0')&&(data.artist.stats.userplaycount != null)) {
							know.push({
								member, plays: data.artist.stats.userplaycount
							})
						}
					}
					know = know.sort((a, b) => parseInt(b.plays) - parseInt(a.plays))
					let allowedusers=[]
					let bannedusers=[]
					for(let z=0;z<know.length;z++){					
						let isbanned = await bans.findOne({
							where: {
								guildID: message.guild.id,
								userID: know[z].member.id
							}
						})
						if(!isbanned){
							allowedusers.push(know[z])
						}else{
							bannedusers.push(know[z])
						}
						
					}
					know=allowedusers
					if (know.length === 0) {
						if(bannedusers.length==0){
							await message.reply(`no one listens to ${data.artist.name} here.`)
						}else{
							await message.reply(`the only users who listen to ${data.artist.name} here are banned from getting crowns.`)
						}
						return
					}				
					const sorted = know[0]
					
					if(parseInt(sorted.plays) >= CrownThreshold){ // Award crown only if plays are above threshold.
					
					try {
						const banned = await bans.findOne({
							where: {
								guildID: message.guild.id,
								userID: sorted.member.id
							}
						})
						if (!banned) {
							await client.models.crowns.create({
								guildID: message.guild.id,
								userID: sorted.member.id,
								artistName: data.artist.name,
								artistPlays: sorted.plays
							})
						}
					} catch (e) {
						if (e.name === 'SequelizeUniqueConstraintError') {
							const crown = await client.models.crowns.findOne({
								where: {
									guildID: message.guild.id,
									artistName: data.artist.name
								}
							})
							if (parseInt(crown.artistPlays) < parseInt(sorted.plays) || !guild.members.has(crown.userID)) {
								await client.models.crowns.update({
									userID: sorted.member.id,
									artistPlays: sorted.plays
								}, {
									where: {
										guildID: message.guild.id,
										artistName: data.artist.name
									}
								})
							}
						}
					}
					
					} // end of check
					
					let num = 1
					let msg =''
					let description=''
					if(bannedusers.length>0){
						msg+="\n\n "+bannedusers.length+" banned "+plur('user',bannedusers.length)+" not included."
					}
					if(parseInt(sorted.plays) < CrownThreshold){
						msg='\n\nTop listener has less than **'+CrownThreshold+'** plays, no crown awarded.'
						description="1. `"+know[0].member.user.username+"` - **"+know[0].plays+"** "+plur('play',know[0].plays)
						if(know.length>1){
							description+="\n"
						}
					}else{
						description="👑 → `"+know[0].member.user.username+"` - **"+know[0].plays+"** "+plur('play',know[0].plays)
						if(know.length>1){
								description+="\n\n"
						}						
						msg="\n\n`"+know[0].member.user.username+"` has been awarded the crown for "+artistName+"!"+msg
					}
										
					
					description += know.slice(1, 15)
						.map(x => `${++num}. \`${x.member.user.username}\` - **${x.plays}** ${plur('play',x.plays)}`)
						.join('\n')
					description+=msg
					//description=description.replace('_','\_').replace('*','\*').replace('~','\~')
					const embed = new BotEmbed(message)
						.setTitle(`Crown scan for ${data.artist.name} in ${message.guild.name}:`)
						.setDescription(description)
						.setURL(data.artist.url)					
					if(description.indexOf('**undefined**')==-1){
						await message.reply('your crown scan for **'+artistName+'** has completed.')
						await message.channel.send(embed)
					}else{
						await message.reply('sorry about this.')
						const embederr = new BotEmbed(message)
						.setTitle(`Who knows ${data.artist.name} in ${message.guild.name}?`)
						.setDescription('An error occurred, sorry.')
						await message.channel.send(embederr)
					}
				}
			}else{ */
				
				
					let isbanned = await bans.findOne({
							where: {
								guildID: message.guild.id,
								userID: message.author.id
							}
						})				
				if(isbanned){
					await message.reply("I can't award you the crown for this artist because you are not allowed to participate in the crowns game.")
					return					
				}
				
				// No one has the crown right now
				if(fullscan){
					
					let paramsyou
					try{
					paramsyou = stringify({
							method: 'artist.getinfo',
							artist: artistName,
							username: user.username,
							api_key: client.apikey,
							format: 'json'
						})
					}catch{
						await message.reply("I can't award you the crown for this artist because you haven't setup your last.fm account with me.")
						return
					}
					const yourdata = await fetch(`${client.url}${paramsyou}`).then(r => r.json())						
					if(parseInt(yourdata.artist.stats.userplaycount)>=CrownThreshold){					
						await crowns.create({
							guildID: message.guild.id,
							userID: message.author.id,
							artistName: artistName,
							artistPlays: parseInt(yourdata.artist.stats.userplaycount)				
						})
						let description="👑 → `"+ message.guild.members.cache.get(message.author.id).user.username+"` - **"+yourdata.artist.stats.userplaycount+"** "+plur('play',yourdata.artist.stats.userplaycount)
						description+="\n\nAs there is no current crownholder, `"+message.author.username+"` has claimed the crown for "+artistName+"!"
						const embed = new BotEmbed(message)
							.setTitle(`Who holds the crown for ${artistName} in ${message.guild.name}?`)
							.setDescription(description)
							.setURL(yourdata.artist.url)		
						await message.channel.send(embed)							
						return
					}else{
						await message.reply("you need at least "+CrownThreshold+" plays of **"+artistName+"** to claim the crown. You currently have "+yourdata.artist.stats.userplaycount+" "+plur('play',yourdata.artist.stats.userplaycount)+".")
						return
					}					
				}
				// New crown done
				
					let paramsyou
					try{
					paramsyou = stringify({
							method: 'artist.getinfo',
							artist: artistName,
							username: user.username,
							api_key: client.apikey,
							format: 'json'
						})
					}catch{
						await message.reply("I can't award you the crown for this artist because you haven't setup your last.fm account with me.")
						return
					}
					const yourdata = await fetch(`${client.url}${paramsyou}`).then(r => r.json())
					if (yourdata.error === 8) {
						await message.reply('Last.fm is having problems right now, try again later')
						return
					}
					if(allcrowns[0].userID==message.author.id){
						if(allcrowns[0].artistPlays<CrownThreshold){
							const ckill = await crowns.destroy({
								where: {
									guildID: message.guild.id,
									artistName: artistName
								}
							})							
							await message.reply("you owned the crown for **"+artistName+"**, but you no longer have at least "+CrownThreshold+" plays. I'm taking back the crown.")							
							return
						}
							await client.models.crowns.update({
									userID: message.author.id,
									artistPlays: parseInt(yourdata.artist.stats.userplaycount)
								}, {
									where: {
										guildID: message.guild.id,
										artistName: artistName
									}
								})						
						await message.reply("you already own the crown for **"+artistName+"**, but I have updated the playcount for this crown to **"+yourdata.artist.stats.userplaycount+"** plays.")
						return
					}					
										
														
				
				//if((parseInt(yourdata.artist.stats.userplaycount)>parseInt(crowndata.artist.stats.userplaycount))||((parseInt(yourdata.artist.stats.userplaycount)>=CrownThreshold)&&( message.guild.members.cache.get(allcrowns[0].userID).roles.get(theftrole)))){
				if((parseInt(yourdata.artist.stats.userplaycount)>parseInt(crowndata.artist.stats.userplaycount))||((parseInt(yourdata.artist.stats.userplaycount)>=CrownThreshold)&&(message.member.roles.cache.has(theftrole)))){	
								await client.models.crowns.update({
									userID: message.author.id,
									artistPlays: parseInt(yourdata.artist.stats.userplaycount)
								}, {
									where: {
										guildID: message.guild.id,
										artistName: artistName
									}
								})					
					
					let description="👑 → `"+message.author.username+"` - **"+yourdata.artist.stats.userplaycount+"** "+plur('play',yourdata.artist.stats.userplaycount)+"\n\n"
					description+="😦 → `"+ message.guild.members.cache.get(allcrowns[0].userID).user.username+"` - **"+crowndata.artist.stats.userplaycount+"** "+plur('play',crowndata.artist.stats.userplaycount)+"\n\n"
					if( message.guild.members.cache.get(allcrowns[0].userID).roles.get(theftrole)){
						description+="`"+message.author.username+"` has stolen the crown for "+artistName+" from `"+ message.guild.members.cache.get(allcrowns[0].userID).user.username+"` due to inactivity!"
					}else{
						description+="`"+message.author.username+"` has stolen the crown for "+artistName+" from `"+ message.guild.members.cache.get(allcrowns[0].userID).user.username+"`!"
					}
					//description=description.replace('_','\_').replace('*','\*').replace('~','\~')
					const embed = new BotEmbed(message)
						.setTitle(`Who holds the crown for ${crowndata.artist.name} in ${message.guild.name}?`)
						.setDescription(description)
						.setURL(crowndata.artist.url)		
					await message.channel.send(embed)					
					//await message.reply('I should award you the crown.')
				}else{
					//await message.reply( message.guild.members.cache.get(allcrowns[0].userID).user.username+' will keep the crown.')
								await client.models.crowns.update({
									userID: allcrowns[0].userID,
									artistPlays: parseInt(crowndata.artist.stats.userplaycount)
								}, {
									where: {
										guildID: message.guild.id,
										artistName: artistName
									}
								})
								
					
					let description="👑 → `"+ message.guild.members.cache.get(allcrowns[0].userID).user.username+"` - **"+crowndata.artist.stats.userplaycount+"** "+plur('play',crowndata.artist.stats.userplaycount)+"\n\n"
					description+="😦 → `"+message.author.username+"` - **"+yourdata.artist.stats.userplaycount+"** "+plur('play',yourdata.artist.stats.userplaycount)+"\n\n"
					if(parseInt(yourdata.artist.stats.userplaycount)!=parseInt(crowndata.artist.stats.userplaycount)){
						description+="`"+ message.guild.members.cache.get(allcrowns[0].userID).user.username+'` will keep the crown for '+artistName+', leading `'+message.author.username+'` by '+(parseInt(crowndata.artist.stats.userplaycount)-parseInt(yourdata.artist.stats.userplaycount))+' '+plur('play',(parseInt(crowndata.artist.stats.userplaycount)-parseInt(yourdata.artist.stats.userplaycount)))+'.'
					}else{
						description+="It's a tie! `"+ message.guild.members.cache.get(allcrowns[0].userID).user.username+'` will keep the crown for '+artistName+'.'
					}
					//description=description.replace('_','\_').replace('*','\*').replace('~','\~')
					const embed = new BotEmbed(message)
						.setTitle(`Who holds the crown for ${crowndata.artist.name} in ${message.guild.name}?`)
						.setDescription(description)
						.setURL(crowndata.artist.url)		
					await message.channel.send(embed)
					
					//await message.reply('**'+ message.guild.members.cache.get(allcrowns[0].userID).user.username+'** will keep the crown for **'+artistName+'** leading by '+(parseInt(crowndata.artist.stats.userplaycount)-parseInt(yourdata.artist.stats.userplaycount))+' plays *('+crowndata.artist.stats.userplaycount+' vs. '+yourdata.artist.stats.userplaycount+')*.')
				}
			//}
		}else{
			await message.react('❌')
		}
	}
}

module.exports = WhoKnowsCommand