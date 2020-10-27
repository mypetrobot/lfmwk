exports.run = async (client, message, args) => {
    if ((message.author.id==client.ownerID)||(message.member.roles.has('638219179010293781'))) {      
			let artistName=""
            try {
				artistName=args.join(` `)
				if(artistName.length>0){
					const { bans, crowns } = client.models
					const amount = await crowns.destroy({
						where: {
							guildID: message.guild.id,
							artistName: artistName
						}
					})
					await message.reply(`Crown for \`${artistName}\` in \`${message.guild.id}\` was destroyed.`)                
				}
            } catch (e) {                
                    await message.reply(`Error ${e} occured.`)                
            }        
    } else {
        //await message.reply(`you're not allowed to do this.`)
    }
}