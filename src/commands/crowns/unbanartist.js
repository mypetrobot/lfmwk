exports.run = async (client, message, args) => {
    if ((message.member.hasPermission('BAN_MEMBERS', false, true, true))||(message.author.id==client.ownerID)){
        const artist=args.join(" ")
        if (artist) {
            const unbanned = await client.models.bans.destroy({
                where: {
                    guildID: 'bannedartist',
                    userID: artist
                }
            })
            if (unbanned) {
                await message.reply(`users can get the crown for ${artist} again.`)
            } else {
                await message.reply(`${artist} was not banned. No changes were made.`)
            }
        } else {
            await message.reply('you must mention an artist want to unban.')
        }
    } else {
        await message.reply("you're not allowed to unban artists.")
    }
}