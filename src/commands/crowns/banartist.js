exports.run = async (client, message, args) => {
    if ((message.member.hasPermission('BAN_MEMBERS', false, true, true))||(message.author.id==client.ownerID)){
        const artist=args.join(" ")
        if (artist) {
            try {                
                const { bans, crowns } = client.models
				const amount = await crowns.destroy({
						where: {
							guildID: message.guild.id,
							artistName: artist
						}
					})
                await bans.create({
                    guildID: 'bannedartist',
                    userID: artist
                })
                await message.reply(`I have banned users from getting the crown for ${artist}.`)
            } catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    await message.reply(`${artist} is already banned. No changes were made.`)
                }
            }
        } else {
            await message.reply('you must specify an artist name to ban.')
        }
    } else {
        await message.reply("you're not allowed to ban artists.")
    }
}