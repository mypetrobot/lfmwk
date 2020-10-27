const BotEmbed = require('../../classes/BotEmbed')

function plur(str,num){if(num!=1){return str+"s"}else{return str}}

exports.run = async (client, message, args) => {
    user = message.member
	let crownthresh=parseInt(args[args.length-1])
    if (args.length > 1) {
		user = message.mentions.members.first()
		crownthresh=parseInt(args[args.length-2])
	}
        let allcrowns = await client.models.crowns.findAll({
            where: {
                guildID: message.guild.id,
                userID: user.id
            }
        })
		
		if(crownthresh<=0){
			await message.reply('please specify a valid scrobble threshold.')
			return
		}
		if(allcrowns.length<=0){
			await message.reply(`${user.user.username} does not have any crowns on this server.`)
			return
		}
		let validcrowns=0
		for(z=0;z<allcrowns.length;z++){
			if(parseInt(allcrowns[z].artistPlays)==crownthresh){
				validcrowns=validcrowns+1
			}
		}
        await message.reply(`**${user.user.username}** has **${validcrowns}** ${plur('crown',validcrowns)} with **${crownthresh}** ${plur('play',crownthresh)}.`)
}