exports.run = async (client, message, args) => {
        const msg = await message.reply('are you sure you want to opt out of the crowns game? ' +
        'This will delete all of your crowns. Click on this reaction to proceed. ')
        await msg.react('✅')
        const rcFilter = (reaction, user) => {
            return reaction.emoji.name === '✅' && user.id === message.author.id
        }
        const rcOptions = {
            max: 1, time: 30000
        }
        const reactions = await msg.awaitReactions(rcFilter, rcOptions)
        if (reactions.size > 0) {    
			const user = message.author
			if (user) {
				try {
					console.log(message.guild.id, user.id)
					const { bans, crowns } = client.models
					const amount = await crowns.destroy({
						where: {
							guildID: message.guild.id,
							userID: user.id
						}
					})
					console.log(amount)
					await bans.create({
						guildID: message.guild.id,
						userID: user.id
					})
					await message.reply('you have successfully opted out of the crowns game. If you would like to participate again, please ask a moderator to unban you.')
				} catch (e) {
					if (e.name === 'SequelizeUniqueConstraintError') {
						await message.reply(`you have already opted out of participating in the crowns game.`)
					}
				}
			} else {
				await message.reply('something went wrong, sorry.')
			}
		} else {
            await message.channel.send('Reaction was not clicked. No changes were made.')
        }

}