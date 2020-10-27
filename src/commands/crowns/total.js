const BotEmbed = require('../../classes/BotEmbed')

exports.run = async (client, message, args) => {
    const crowns = await client.models.crowns.findAll({
        where: {
            guildID: message.guild.id
        }
    })
	await message.reply(`there are a total of **${crowns.length}** unique crowns in this server.`)       
}