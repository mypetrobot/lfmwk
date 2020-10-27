const BotEmbed = require('../../classes/BotEmbed')

exports.run = async (client, message, args) => {
	
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
	let crowntotal=0;
    const entries = [...amounts.entries()]
	const fullentries=entries.sort(([_, a], [__, b]) => b - a)
    //const hasCrowns = entries.findIndex(([userID]) => userID === message.author.id)
	for (q=0;q<fullentries.length;q++){
		if(fullentries[q][0] === message.author.id){
			BoardLocation=(q+1);
			crowntotal=fullentries[q][1]
		}
	}
	let LocationMsg = ""
	let crownsword="crown"
	if(crowntotal!=1){
		crownsword+="s"
	}
	if(BoardLocation != -1){		
		await message.reply("your **"+crowntotal+"** "+crownsword+" rank you **#"+BoardLocation+"** out of **"+fullentries.length+"** total users on the crown leaderboard.")
	}else{
		await message.reply("I can't find you on the crown leaderboard.")
	}
                 
}