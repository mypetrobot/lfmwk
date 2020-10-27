const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')
const BotEmbed = require('../classes/BotEmbed')

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  //var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  var time = date + ' ' + month + ' ' + year;
  return time;
}

function plur(str,num){if(num!=1){return str+"s"}else{return str}}

class PlaysEqualCommand extends Command {

    constructor() {
        super({
            name: 'playsequal',
            description: 'Displays the total number of artists with the specified number of plays by a given user over a specified time period. The results are limited to the user\'s top 1000 artists for that time period. If no user is specified, the bot will default to you. If no time period is specified, the bot will default to overall.',
            usage: [
				'playsequal <number>',
				'playsequal <number> <time period w/m/q/y/o>',
				'playsequal <number> <user>',
				'playsequal <number> <time period w/m/q/y/o> <user>'
				],
			aliases: ['pe']
        })
	}
	
    async run(client, message, args) {
			const { bans, users, crowns } = client.models
			let user
			let discorduser=message.author
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
				discorduser=message.mentions.members.first().user
				}catch{
					user = await users.findOne({
						where: {
							userID: message.author.id
						}
					})
				}
			}

			let pthresh=parseInt(args[0])
			
			if(isNaN(pthresh)){
				await message.reply('you need to specify a playcount.')
				return
			}
			
			if((pthresh<=0)||(pthresh>=10000000)){
				await message.reply('try a reasonable number please.')
				return
			}

			let periodtime="overall"
			let timeperiod="overall"
			let attrpos=1
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
			}catch{}
			const paramsartist = stringify({
					method: 'user.gettopartists',				
					user: user.username,
					api_key: client.apikey,
					limit:1000,
					period:periodtime,
					format: 'json'					
				})
			const dataartist = await fetch(`${client.url}${paramsartist}`).then(r => r.json())
			if (dataartist.error) {
				await message.reply('something went wrong with getting info from Last.fm.')
				console.error(dataartist);
				return
			}
			
			

			
			let elig=0			
			
			//let crownstop10=0
			for (let z=0;z<dataartist.topartists.artist.length;z++){
				if(dataartist.topartists.artist[z].playcount==pthresh){elig++}
			}
			let msg='**'+elig+'** of **'+user.username+'**\'s top **'+dataartist.topartists.artist.length+'** '+plur("artist",dataartist.topartists.artist.length)+' '+timeperiod+' have exactly **'+pthresh+"** "+plur("play",pthresh)
			if(periodtime!='overall'){
				msg+=' during that timeframe'
			}
			msg+="."
			await message.reply(msg)
    }

}

module.exports = PlaysEqualCommand