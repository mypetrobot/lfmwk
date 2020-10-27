const BotEmbed = require('../../classes/BotEmbed')

exports.run = async (client, message, args) => {
	const { bans, users } = client.models
    user = message.member
    if (args.length > 0) {
		user = message.mentions.members.first()
	}
    const allcrowns = await client.models.crowns.findAll({
        where: {
            guildID: message.guild.id
        }
    })
	
	const usercrowns = await client.models.crowns.findAll({
        where: {
            guildID: message.guild.id,
			userID: user.id
        }
    })	
	if(usercrowns.length<1){
		await message.reply(`${user.user.username} does not have any crowns in this server.`)
		return
	}
	const crowns=allcrowns.sort((a, b) => parseInt(b.artistPlays) - parseInt(a.artistPlays))
	const lfmuser = await users.findOne({
				where: {
					userID: user.id
				}
	})
	if (crowns.length > 0) {		
            let tester = []
			for(i=0;i<crowns.length;i++){
				if(crowns[i].userID==user.id){
					tester.push(crowns[i])
					tester[tester.length-1].rank=i+1
				}
				if((tester.length>=10)||(tester.length==usercrowns.length)){
					break
				}
			}
			let num = 0
            const description = tester
                .sort((a, b) => parseInt(b.artistPlays) - parseInt(a.artistPlays))
                .map(x => `${x.rank}. ${x.artistName} - **${x.artistPlays}** plays`)
				.join('\n')                
            const embed = new BotEmbed(message)
                .setTitle(`The ranks of ${user.user.username}'s top crowns in ${message.guild.name}`)
                .setDescription(description)
                .setThumbnail(user.user.avatarURL)
				.setURL("https://www.last.fm/user/"+lfmuser.username)				
            await message.channel.send(embed)
            
        } else {
            await message.reply(`something went wrong.`)
        }      
}