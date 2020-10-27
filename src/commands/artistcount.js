const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class ArtistCountCommand extends Command {

    constructor() {
        super({
            name: 'artistcount',
            description: 'Displays the total number of artists scrobbled by a given user for a given period of time. If no user is specified, the bot will return your total number of artists.',
            usage: [
				'artistcount',
				'artistcount <time period w/m/q/y/o>',
				'artistcount <user> <time period w/m/q/y/o>'
				],
			aliases: ['ac']
        })
    }

    async run(client, message, args) {
		const { bans, users, crowns } = client.models
		let user
		let periodtime="overall"
		let timeperiod="overall"
		let attrpos=1
        if (args.length === 0) {
			user = await users.findOne({
				where: {
					userID: message.author.id
				}
			})
        } else {
			try{
				user = await users.findOne({
					where: {
						userID: message.mentions.members.first().id
					}
				})
			}catch{
				user = await users.findOne({
				where: {
					userID: message.author.id
				}
			})
			}
			try{
				if(args[attrpos].toLowerCase()=='w'){
				}
			}catch{
				attrpos=0
			}
			//console.log(attrpos)
			try{
				if((args[attrpos].toLowerCase()=='w')||(args[attrpos].toLowerCase()=='week')||(args[attrpos].toLowerCase()=='7')){
					periodtime='7day'
					timeperiod="over the last week"
				}
				if((args[attrpos].toLowerCase()=='m')||(args[attrpos].toLowerCase()=='month')||(args[attrpos].toLowerCase()=='30')){
					periodtime='1month'
					timeperiod="over the last month"
				}
				if((args[attrpos].toLowerCase()=='q')||(args[attrpos].toLowerCase()=='quarter')||(args[attrpos].toLowerCase()=='90')){
					periodtime='3month'
					timeperiod="over the last 3 months"
				}
				if((args[attrpos].toLowerCase()=='h')||(args[attrpos].toLowerCase()=='half')||(args[attrpos].toLowerCase()=='180')){
					periodtime='6month'
					timeperiod="over the last 6 months"
				}
				if((args[attrpos].toLowerCase()=='y')||(args[attrpos].toLowerCase()=='year')||(args[attrpos].toLowerCase()=='365')){
					periodtime='12month'
					timeperiod="over the last year"
				}				
				if((args[attrpos].toLowerCase()=='a')||(args[attrpos].toLowerCase()=='o')||(args[attrpos].toLowerCase()=='alltime')||(args[attrpos].toLowerCase()=='overall')){
					periodtime='overall'
					timeperiod="overall"
				}
			}catch{
				await message.reply('the parameters passed were wonky. Try again.')
				return
			}			
        }
		
		const params = stringify({
				method: 'user.gettopartists',				
				user: user.username,
				api_key: client.apikey,
				limit:5,
				period:periodtime,
				format: 'json',
			})
		const data = await fetch(`${client.url}${params}`).then(r => r.json())
		if (data.error) {
            await message.reply('something went wrong with getting info from Last.fm.')
            console.error(data);
            return
        } else {
            await message.reply('**'+user.username+'** has scrobbled **'+data.topartists['@attr'].total+'** artists '+timeperiod+".")
        }        
    }

}

module.exports = ArtistCountCommand