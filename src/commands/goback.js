const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

var isDate = function(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}
function timeConverter(t){  
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];  
  var time = t.split('-')[2] + ' ' + months[parseInt(t.split('-')[1])-1] + ' ' + t.split('-')[0];
  return time;
}

class GoBackCommand extends Command {

    constructor() {
        super({
            name: 'goback',
            description: 'Displays a random song scrobbled by a given user on a given date. If no user is specified, the bot will default to you. If no date is specified, the bot will choose the last 24 hours as the time period.',
            usage: [
				'goback',
				'goback <user>',
				'goback <YYYY-MM-DD> <GMT offset>',
				'goback <user> <YYYY-MM-DD> <GMT offset>'
				],
			aliases: ['gb']
        })
    }

    async run(client, message, args) {
		const { bans, users, crowns } = client.models
		let user
		let periodtime="overall"
		let timeperiod="overall"
		let attrpos=1
		let timemult=1
		let timedesc=""
		let gmt=0
		let enddate = Math.floor(Date.now() / 1000)
		let startdate=enddate		
        if (args.length === 0) {
			user = await users.findOne({
				where: {
					userID: message.author.id
				}
			})
			startdate=enddate-(((60*60*24))*1)
			timeperiod="over the last 24 hours"
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
			if((args.length>1)&&(!message.mentions.members.first())){
				attrpos=0
			}
			if(isDate(args[attrpos])){	
				if(args[attrpos].split('-').length != 3){
					await message.reply("dates need to be in YYYY-MM-DD format.")
					return
				}
				try{
					gmt=((parseInt(args[attrpos+1])*-1)*3600)
				}catch{
					gmt=0
				}
				if(isNaN(gmt)){
					gmt=0
					timedesc=""	
				}else{
					timedesc=args[attrpos+1]+" "
				}
				startdate=parseInt((new Date(args[attrpos]).getTime() / 1000).toFixed(0))+gmt
				timeperiod="on "+timeConverter(args[attrpos])+" "+timedesc+"GMT"
				enddate=startdate+(((60*60*24))*1)				
				//console.log(startdate+" - "+enddate)
			}else{
				startdate=enddate-(((60*60*24))*1)
				timeperiod="over the last 24 hours"
			}
        }
		//console.log(startdate+" - "+enddate)
		let params
		if(startdate!=enddate){
			params = stringify({
					method: 'user.getrecenttracks',				
					user: user.username,
					api_key: client.apikey,
					limit:200,
					from:startdate,
					to:enddate,				
					format: 'json',
				})			
		}else{
			await message.reply("I think you did something wrong.")
			return			
		}
		const data = await fetch(`${client.url}${params}`).then(r => r.json())
		if (data.error) {
            await message.reply('something went wrong with getting info from Last.fm.')
            console.error(data);
            return
        } else {
			if(parseInt(data.recenttracks['@attr'].total)==0){
				await message.reply("**"+user.username+"** didn't scrobble anything "+timeperiod+".")
				return
			}else{
				let trno=Math.floor(Math.random() * data.recenttracks.track.length)
				let msg="**"+user.username+"** scrobbled **"+data.recenttracks.track[trno].name+"** by **"+data.recenttracks.track[trno].artist['#text']+"** "+timeperiod+"."
				await message.reply(msg)
            }
        }        
    }

}

module.exports = GoBackCommand