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
			let checker=message.guild.members.cache.get(x.userID).user.username
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
    //const hasCrowns = entries.findIndex(([userID]) => userID === message.author.id)
	for (q=0;q<fullentries.length;q++){
		if(fullentries[q][0] === message.author.id){
			BoardLocation=(q+1);
		}		
	}
	let LocationMsg = ""
	if(BoardLocation != -1){
		LocationMsg='\n\nYour position is: **#'+BoardLocation+'** with **'+fullentries[BoardLocation-1][1]+"** crowns."
	}
    //const authorPos = hasCrowns ? hasCrowns + 1 : null
	let startrank=0
	let endrank=20
	let embedtitle=`${message.guild.name}'s crown leaderboard`
	if(args.length>0){
		if(!isNaN(args[0])){
			//console.log(args[0])
			startrank=parseInt(args[0])-1-5
			if(startrank<0){
				startrank=0
			}
			endrank=parseInt(args[0])+5
			num=startrank
			embedtitle=`${message.guild.name}'s crown leaderboard (${startrank+1}-${endrank})`
		}	
		if((args[0].toLowerCase()=="me")&&(BoardLocation != -1)){
			//console.log(args[0])
			startrank=parseInt(BoardLocation)-1-5
			if(startrank<0){
				startrank=0
			}
			endrank=parseInt(BoardLocation)+5
			num=startrank
			embedtitle=`${message.guild.name}'s crown leaderboard (${startrank+1}-${endrank})`
		}
	}
	//console.log(startrank+", "+endrank)
	
	
	const description = fullentries.slice(startrank, endrank)                
                .map(([userID, amount]) => {
					if((num+1==parseInt(BoardLocation))||(num+1==parseInt(args[0]))){
						return `***${++num}. ${message.guild.members.cache.get(userID).user.username} with ${amount} crowns***`
						
					}else{
						return `${++num}. ${message.guild.members.cache.get(userID).user.username} with ${amount} crowns`						
					}
                })
				.join('\n') + LocationMsg
    const embed = new BotEmbed(message)
        .setTitle(embedtitle)
        .setThumbnail(message.guild.iconURL)
        .setDescription(description)
            //entries.map(([userID, amount]) => {
            //       return `${++num}. ${ message.guild.members.cache.get(userID).user.username} with **${amount}** crowns`
            //    })
                //.join('\n') + `${authorPos ? `\n\nYour position is: **${authorPos}**` : ``}`
			//	.join('\n') + LocationMsg
        //)
    await message.channel.send(embed)                 
}