const BotEmbed = require('../../classes/BotEmbed')

exports.run = async (client, message, args) => {
    const allcrowns = await client.models.crowns.findAll({
        where: {
            guildID: message.guild.id
        }
    })
	const crowns=allcrowns.sort((a, b) => parseInt(b.artistPlays) - parseInt(a.artistPlays))
	if (crowns.length > 0) {		
            const tester = crowns.slice(0, 20)
			for(i=0;i<tester.length;i++){
				try{
				tester[i].username= message.guild.members.cache.get(tester[i].userID).user.username
				}catch{
					tester[i].username="???"
				}
			}
			let num = 0
            const description = tester
                .sort((a, b) => parseInt(b.artistPlays) - parseInt(a.artistPlays))
                .map(x => `${++num}. ${x.artistName} (**${x.artistPlays}**, ${x.username})`)
				.join('\n')                
            const embed = new BotEmbed(message)
                .setTitle(`Crowns with the highest play counts in ${message.guild.name}`)
                .setDescription(description)
                .setThumbnail(message.guild.iconURL)				
            await message.channel.send(embed)
            
        } else {
            await message.reply(`something went wrong.`)
        }      
}