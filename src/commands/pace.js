const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

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

class PaceCommand extends Command {

    constructor() {
        super({
            name: 'pace',
            description: 'Displays the potential date a user will hit a particular number of scrobbles based on their scrobble rate for a given time period. If no user is specified, the bot will default to you.',
            usage: [
				'pace <time period h/d/w/m/q/y> <# of periods> <goal>',
				'pace <user> <time period h/d/w/m/q/y> <# of periods> <goal>'
				],
			aliases: ['when','pc']
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
		let hours
		let goal
		const enddate = Math.floor(Date.now() / 1000)
		let startdate=enddate		
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
			if((args.length>1)&&(!message.mentions.members.first())){
				attrpos=0
			}			
			timemult=parseFloat(args[attrpos+1])
			if(isNaN(timemult)){
				timemult=1
			}
			if((timemult<=0)||(timemult>10000)){
				await message.reply("don't try to break things please.")
				return
			}
			goal=parseInt(args[attrpos+2])
			if(isNaN(goal)){
				await message.reply("you need to specify a target scrobble milestone.")
				return
			}
			if((goal<1)||(goal>10000000)){
				await message.reply("don't try to break things please.")
				return
			}			
			//console.log(timemult+" "+args[attrpos+1])
			try{
				if((args[attrpos].toLowerCase()=='i')||(args[attrpos].toLowerCase()=='minute')){
					startdate=enddate-(60*timemult)										
					timeperiod="over the last "+timemult+" minute"
					if(timemult!=1){
						timeperiod+="s"
					}
					timedesc="minutes"
					hours=timemult/60
				}					
				
				if((args[attrpos].toLowerCase()=='h')||(args[attrpos].toLowerCase()=='hour')){
					startdate=enddate-(((60*60))*timemult)										
					timeperiod="over the last "+timemult+" hour"
					if(timemult!=1){
						timeperiod+="s"
					}
					timedesc="hour"
					hours=timemult
				}				
				if((args[attrpos].toLowerCase()=='d')||(args[attrpos].toLowerCase()=='day')){
					startdate=enddate-(((60*60*24))*timemult)										
					timeperiod="over the last "+timemult+" day"
					if(timemult!=1){
						timeperiod+="s"
					}
					timedesc="day"
					hours=timemult*24
				}				
				if((args[attrpos].toLowerCase()=='w')||(args[attrpos].toLowerCase()=='week')||(args[attrpos].toLowerCase()=='7')){
					startdate=enddate-(((60*60*24)*7)*timemult)										
					timeperiod="over the last "+timemult+" week"
					if(timemult!=1){
						timeperiod+="s"
					}
					timedesc="week"
					hours=timemult*168
				}
				if((args[attrpos].toLowerCase()=='m')||(args[attrpos].toLowerCase()=='month')||(args[attrpos].toLowerCase()=='30')){
					startdate=enddate-(((60*60*24)*30)*timemult)					
					timeperiod="over the last "+timemult+" month"
					if(timemult!=1){
						timeperiod+="s"
					}
					timedesc="month"
					hours=timemult*720
				}
				if((args[attrpos].toLowerCase()=='q')||(args[attrpos].toLowerCase()=='quarter')||(args[attrpos].toLowerCase()=='90')){
					startdate=enddate-(((60*60*24)*90)*timemult)					
					timeperiod="over the last "+(timemult*3)+" months"
					timedesc="quarter"
				}
				if((args[attrpos].toLowerCase()=='ha')||(args[attrpos].toLowerCase()=='half')||(args[attrpos].toLowerCase()=='180')){
					startdate=enddate-(((60*60*24)*180)*timemult)					
					timeperiod="over the last "+(timemult*6)+" months"
					timedesc="half year"
					hours=timemult*2160
				}
				if((args[attrpos].toLowerCase()=='y')||(args[attrpos].toLowerCase()=='year')||(args[attrpos].toLowerCase()=='365')){
					startdate=enddate-(((60*60*24)*365)*timemult)					
					timeperiod="over the last "+timemult+" year"
					if(timemult!=1){
						timeperiod+="s"
					}
					timedesc="year"
					hours=timemult*8760
				}				
				if((args[attrpos].toLowerCase()=='a')||(args[attrpos].toLowerCase()=='o')||(args[attrpos].toLowerCase()=='alltime')||(args[attrpos].toLowerCase()=='overall')){					
					timeperiod="overall"
				}
			}catch{
				await message.reply('the parameters passed were wonky. Try again.')
				return
			}			
        }
		//console.log(startdate+" - "+enddate)
		let params = stringify({
					method: 'user.getrecenttracks',				
					user: user.username,
					api_key: client.apikey,
					limit:5,			
					format: 'json',
			})
		const paramsoverall = stringify({
					method: 'user.getrecenttracks',				
					user: user.username,
					api_key: client.apikey,
					limit:5,			
					format: 'json',
			})			
		if(startdate!=enddate){
			params = stringify({
					method: 'user.getrecenttracks',				
					user: user.username,
					api_key: client.apikey,
					limit:5,
					from:startdate,
					to:enddate,				
					format: 'json',
				})			
		}else{
			await message.reply('this is not a period of time that I recognize.')
			return
		}
		const data = await fetch(`${client.url}${params}`).then(r => r.json())
		if (data.error) {
            await message.reply('something went wrong with getting info from Last.fm.')
            console.error(data);
            return
        } else {
			const dataoverall = await fetch(`${client.url}${paramsoverall}`).then(r => r.json())
			if (dataoverall.error) {
				await message.reply('something went wrong with getting info from Last.fm.')
				console.error(dataoverall);
				return
			} else {
				let scrobblerate=parseInt(data.recenttracks['@attr'].total)/hours
				//console.log(parseInt(data.recenttracks['@attr'].total))
				let curscrobbles=parseInt(dataoverall.recenttracks['@attr'].total)
				if(goal<=curscrobbles){
					await message.reply('**'+user.username+'** already has **'+goal+'** scrobbles.')
					return
				}
				let i=0
				if(scrobblerate<=0){
					await message.reply('**'+user.username+'** has been scrobbling at a rate too slow '+timeperiod+' to ever hit **'+goal+'**.')
					return					
				}
				do{
					curscrobbles=curscrobbles+scrobblerate
					i++
				}while(curscrobbles<goal)
				let msg="using their rate of "+(Math.round(((parseInt(data.recenttracks['@attr'].total)/hours)*100))/100)+" scrobble"
				if((Math.round(((parseInt(data.recenttracks['@attr'].total)/hours)*100))/100)!=1){
					msg+="s"
				}
				msg+=" per hour "+timeperiod+", **"+user.username+"** is on pace to hit **"+goal+"** scrobbles on **"+timeConverter(enddate+(((60*60))*i))+"**."
				/*
				let scrob=""			
				if (data.recenttracks['@attr'].total!=1){
					scrob="s"
				}
				let msg='**'+user.username+'** has **'+data.recenttracks['@attr'].total+'** scrobble'+scrob+' '+timeperiod
				if((timemult>1)&&(startdate!=enddate)){
					msg+=" *(Averaging "+(Math.round(((parseInt(data.recenttracks['@attr'].total)/timemult)*100))/100)+" per "+timedesc+")*"
				}
				msg+="."
				*/
				await message.reply(msg)
			}
        }        
    }

}

module.exports = PaceCommand