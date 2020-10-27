const { MessageEmbed } = require('discord.js')

module.exports = class extends MessageEmbed {

    constructor(message) {
        super()
        this.setColor(message.member.displayColor)
            .setFooter(`Command executed by ${message.author.tag}`, message.author.avatarURL)
            .setTimestamp()
    }
}