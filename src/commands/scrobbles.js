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

class ScrobblesCommand extends Command {

    constructor() {
        super({
            name: 'scrobbles',
            description: 'Displays the total number of scrobbles of a given user for a given period of time. If no user is specified, the bot will return your total number of scrobbles.',
            usage: [
				'scrobbles',
				'scrobbles <time period h/d/w/m/q/y/o>',
				'scrobbles <user> <time period h/d/w/m/q/y/o>',
				'scrobbles <time period h/d/w/m/q/y/o> <# of periods>',
				'scrobbles <user> <time period h/d/w/m/q/y/o> <# of periods>',
				'scrobbles <YYYY-MM-DD> <GMT offset>',
				'scrobbles <user> <YYYY-MM-DD> <GMT offset>',
				'scrobbles on <YYYY-MM-DD> <GMT offset>',
				'scrobbles <user> on <YYYY-MM-DD> <GMT offset>'
				],
			aliases: ['s']
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
			if((args[attrpos].toLowerCase()=='on')&&(isDate(args[attrpos+1]))){
				attrpos=attrpos+1
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
				try{
					if(args[attrpos-1].toLowerCase()=='on'){
						timeperiod="on "
						enddate=startdate+(((60*60*24))*1)
					}else{
						timeperiod="since "
					}
				}catch{timeperiod="since "}
				timeperiod+=timeConverter(args[attrpos])+" "+timedesc+"GMT"					

				//console.log(startdate+" - "+enddate)
			}else{
				timemult=parseFloat(args[attrpos+1])
				if(isNaN(timemult)){
					timemult=1
				}
				if((timemult<=0)||(timemult>10000)){
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
						timedesc="minute"				
					}				
					
					if((args[attrpos].toLowerCase()=='h')||(args[attrpos].toLowerCase()=='hour')){
						startdate=enddate-(((60*60))*timemult)										
						timeperiod="over the last "+timemult+" hour"
						if(timemult!=1){
							timeperiod+="s"
						}
						timedesc="hour"
					}				
					if((args[attrpos].toLowerCase()=='d')||(args[attrpos].toLowerCase()=='day')){
						startdate=enddate-(((60*60*24))*timemult)										
						timeperiod="over the last "+timemult+" day"
						if(timemult!=1){
							timeperiod+="s"
						}
						timedesc="day"
					}				
					if((args[attrpos].toLowerCase()=='w')||(args[attrpos].toLowerCase()=='week')||(args[attrpos].toLowerCase()=='7')){
						startdate=enddate-(((60*60*24)*7)*timemult)										
						timeperiod="over the last "+timemult+" week"
						if(timemult!=1){
							timeperiod+="s"
						}
						timedesc="week"
					}
					if((args[attrpos].toLowerCase()=='m')||(args[attrpos].toLowerCase()=='month')||(args[attrpos].toLowerCase()=='30')){
						startdate=enddate-(((60*60*24)*30)*timemult)					
						timeperiod="over the last "+timemult+" month"
						if(timemult!=1){
							timeperiod+="s"
						}
						timedesc="month"
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
					}
					if((args[attrpos].toLowerCase()=='y')||(args[attrpos].toLowerCase()=='year')||(args[attrpos].toLowerCase()=='365')){
						startdate=enddate-(((60*60*24)*365)*timemult)					
						timeperiod="over the last "+timemult+" year"
						if(timemult!=1){
							timeperiod+="s"
						}
						timedesc="year"
					}				
					if((args[attrpos].toLowerCase()=='a')||(args[attrpos].toLowerCase()=='o')||(args[attrpos].toLowerCase()=='alltime')||(args[attrpos].toLowerCase()=='overall')){					
						timeperiod="overall"
					}
				
				}catch{
					await message.reply('the parameters passed were wonky. Try again.')
					return
				}			
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
		}
		const data = await fetch(`${client.url}${params}`).then(r => r.json())
		if (data.error) {
            await message.reply('something went wrong with getting info from Last.fm.')
            console.error(data);
            return
        } else {
			let scrob=""
			if (data.recenttracks['@attr'].total!=1){
				scrob="s"
			}
			let msg='**'+user.username+'** '
			if(args.join(' ').indexOf("on ")!=-1){
				msg+="had"
			}else{
				msg+="has"
			}
			msg+=' **'+data.recenttracks['@attr'].total+'** scrobble'+scrob+' '+timeperiod
			if((timemult>1)&&(startdate!=enddate)){
				msg+=" *(Averaging "+(Math.round(((parseInt(data.recenttracks['@attr'].total)/timemult)*100))/100)+" per "+timedesc+")*"
			}
			msg+="."
            await message.reply(msg)
               
        }        
    }

}

module.exports = ScrobblesCommand