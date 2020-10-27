const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')
const BotEmbed = require('../classes/BotEmbed')

class ListCommand extends Command {

    constructor() {
        super({
            name: 'list',
            description: 'Displays a list of the most scrobbled artists, albums, or tracks for a given user for a given period of time. If no user is specified, the bot will default to you.',
            usage: [
				'list <type (a)rtist/a(l)bum/(t)rack> <time period w/m/q/y/o> <# of entries>',
				'list <user> <type (a)rtist/a(l)bum/(t)rack> <time period w/m/q/y/o> <# of entries>'
				],
			aliases: ['l']
        })
    }

    async run(client, message, args) {
		const { bans, users, crowns } = client.models
		let user
		let periodtime=""
		let timeperiod=""
		let attrpos=1
		let listtype=""
		let listlength=0
		let discorduser=message.author
		let mapFunc, rootProp, subProp
		let num=0
        if (args.length === 0) {
			await message.reply('you need to give me some information about the list that you want.')
			return
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
			if(!message.mentions.members.first()){
				attrpos=0
			}
			//console.log(attrpos)
			try{			
				if((args[attrpos].toLowerCase()=='a')||(args[attrpos].toLowerCase()=='artists')||(args[attrpos].toLowerCase()=='artist')){
					listtype="artists"					
				}
				if((args[attrpos].toLowerCase()=='al')||(args[attrpos].toLowerCase()=='l')||(args[attrpos].toLowerCase()=='albums')||(args[attrpos].toLowerCase()=='album')){
					listtype="albums"					
				}
				if((args[attrpos].toLowerCase()=='t')||(args[attrpos].toLowerCase()=='tracks')||(args[attrpos].toLowerCase()=='track')||(args[attrpos].toLowerCase()=='s')||(args[attrpos].toLowerCase()=='song')||(args[attrpos].toLowerCase()=='songs')){
					listtype="tracks"					
				}				
				
				if((args[attrpos+1].toLowerCase()=='w')||(args[attrpos+1].toLowerCase()=='week')||(args[attrpos+1].toLowerCase()=='7')){
					periodtime='7day'
					timeperiod="for the last week"
				}
				if((args[attrpos+1].toLowerCase()=='m')||(args[attrpos+1].toLowerCase()=='month')||(args[attrpos+1].toLowerCase()=='30')){
					periodtime='1month'
					timeperiod="for the last month"
				}
				if((args[attrpos+1].toLowerCase()=='q')||(args[attrpos+1].toLowerCase()=='quarter')||(args[attrpos+1].toLowerCase()=='90')){
					periodtime='3month'
					timeperiod="for the last 3 months"
				}
				if((args[attrpos+1].toLowerCase()=='h')||(args[attrpos+1].toLowerCase()=='half')||(args[attrpos+1].toLowerCase()=='180')){
					periodtime='6month'
					timeperiod="for the last 6 months"
				}
				if((args[attrpos+1].toLowerCase()=='y')||(args[attrpos+1].toLowerCase()=='year')||(args[attrpos+1].toLowerCase()=='365')){
					periodtime='12month'
					timeperiod="for the last year"
				}				
				if((args[attrpos+1].toLowerCase()=='a')||(args[attrpos+1].toLowerCase()=='o')||(args[attrpos+1].toLowerCase()=='alltime')||(args[attrpos+1].toLowerCase()=='overall')){
					periodtime='overall'
					timeperiod="overall"
				}

				if(listtype==""){
					await message.reply('you need to specify a proper list type.')
					return					
				}

				if(periodtime==""){
					await message.reply('you need to specify a proper time period.')
					return					
				}
				
				listlength=parseInt(args[attrpos+2])
				if((listlength<1)||(listlength>25)||(isNaN(listlength))){
					await message.reply('a list needs to be between 1-25 entries long.')
					return
				}
				
				
			}catch{
				await message.reply('the parameters passed were wonky. Try again.')
				return
			}			
        }
		/*
		console.log('Time: '+periodtime+"\n"+
					'Type: '+listtype+"\n"+
					'Number: '+listlength)
		*/
		const params = stringify({
				method: 'user.gettop'+listtype,				
				user: user.username,
				api_key: client.apikey,
				limit:listlength,
				period:periodtime,
				format: 'json',
			})
		const data = await fetch(`${client.url}${params}`).then(r => r.json())
		if (data.error) {
            await message.reply('something went wrong with getting info from Last.fm.')
            console.error(data);
            return
        } else {
			if(listtype=="artists"){
				mapFunc = x => `${++num}. **${x.name}** - ${x.playcount} plays`;
				[rootProp, subProp] = [`topartists`, `artist`];
			}
			if(listtype=="tracks"){
				mapFunc = x => `${++num}. **${x.name}** by **${x.artist.name}** - ${x.playcount} plays`;
				[rootProp, subProp] = [`toptracks`, `track`];
			}
			if(listtype=="albums"){
				mapFunc = x => `${++num}. **${x.name}** by **${x.artist.name}** - ${x.playcount} plays`;
				[rootProp, subProp] = [`topalbums`, `album`];
			}			
            //await message.reply('**'+user.username+'** has scrobbled **'+data.topartists['@attr'].total+'** artists '+timeperiod+".")
			const arr = data[rootProp][subProp].slice(0, listlength);
			
			let msgtitle=`${user.username}'s top ${listlength} ${listtype} ${timeperiod}`
			if(listlength==1){
				msgtitle=`${user.username}'s top ${listtype.substring(0, listtype.length-1)} ${timeperiod}`
			}
			const embed = new BotEmbed(message)
					//.setTitle(`Scrobbler Overview: ${discorduser.username}`)
					.setDescription(arr
						.map(mapFunc)
						.join(`\n`))																																			
					//.setThumbnail(discorduser.avatarURL)
					.setAuthor(msgtitle, discorduser.avatarURL, 'https://www.last.fm/user/'+user.username)
					//.setThumbnail(discorduser.avatarURL)
					
			await message.channel.send(embed)
        }        
    }

}

module.exports = ListCommand