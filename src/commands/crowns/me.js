const BotEmbed = require('../../classes/BotEmbed')
const MaxArtistLength=31

exports.run = async (client, message, args) => {
    user = message.member
    if (args.length > 0) {
		user = message.mentions.members.first()
	}
        let allcrowns = await client.models.crowns.findAll({
            where: {
                guildID: message.guild.id,
                userID: user.id
            }
        })
		
		for(z=0;z<allcrowns.length;z++){
			if(allcrowns[z].artistName.length>MaxArtistLength){
				allcrowns[z].artistName=allcrowns[z].artistName.substring(0,MaxArtistLength-3) + '...'
			}
		}
		const crowns=allcrowns.sort((a, b) => parseInt(b.artistPlays) - parseInt(a.artistPlays))
		await message.reply("I'm DMing you a full list of "+user+"'s crowns. Please stand by.")
        if (crowns.length > 0) {			
			await message.author.send(`**${user.user.tag} has been awarded `+parseInt(crowns.length)+` crowns in ${message.guild.name}**.`)
            let num = 0
			for(i=0;i<Math.ceil(crowns.length/40);i++){
				let LastDisplayed = (i*40)+40
				if(LastDisplayed > crowns.length){
					LastDisplayed = crowns.length
				}
				const description = crowns.slice(i*40, LastDisplayed)
					//.sort((a, b) => parseInt(b.artistPlays) - parseInt(a.artistPlays))
					.map(x => `${++num}. ${x.artistName} - **${x.artistPlays}**`)
					.join('\n')                
				const embed = new BotEmbed(message)
					.setTitle(`Crowns `+parseInt((i*40)+1)+`-`+LastDisplayed+` in ${message.guild.name}`)
					.setDescription(description)
					.setThumbnail(user.user.avatarURL)				
				await message.author.send(embed)				
            }
        } else {
            await message.author.send(`${user.user.username} does not have any crowns in ${message.guild.name}.`)
        }            
}