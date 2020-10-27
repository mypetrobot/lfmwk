const BotEmbed = require('../../classes/BotEmbed')

exports.run = async (client, message, args) => {
	if (message.author.id==client.ownerID) {  
		const crowns = await client.models.crowns.findAll({
			where: {
				guildID: message.guild.id
			}
		})
		
		
		const amounts = new Map()
		crowns.forEach(x => {
			try{
				let checker= message.guild.members.cache.get(x.userID).user.username
				if (amounts.has(x.userID)) {
					let amount = amounts.get(x.userID)
					amounts.set(x.userID, ++amount)
				} else {
					amounts.set(x.userID, 1)
				}
			}catch{
			}
		})
		let num = 0	
		let BoardLocation = -1;
		const entries = [...amounts.entries()]
		let fullentries=entries.sort(([_, a], [__, b]) => b - a)
		//const authorPos = hasCrowns ? hasCrowns + 1 : null	
		const description = fullentries               
					.map(([userID, amount]) => {
					   return `${++num}. ${ message.guild.members.cache.get(userID).user.username} - ${amount}`
					})
					.join('\n')
		console.log(description)
	}
}