const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

const difference = (a, b) => {
  if (a > b) return a - b;
  else return b - a;
};

class TasteCommand extends Command {

    constructor() {
        super({
            name: 'taste',
            description: 'Compare your taste with another user. ' +
            'This is a variation on FMCord\'s taste command. ' +
            'The default time period is overall and the default number of compared artists is 250.',
            usage: [
                'taste @<username> <# of top artists>', 
                'taste @<username> <time period w/m/q/y/o>',
				'taste @<username> <time period w/m/q/y/o> <# of top artists>'
            ],
            aliases: ['t']
        })
    }

    async run(client, message, args) {
		const { bans, users, crowns } = client.models
		
        if (args.length === 0) {
                await message.reply('you need to specify a user to compare tastes with.')
        } else {
			const user = await users.findOne({
				where: {
					userID: message.author.id
				}
			})
						
			const username2 = message.mentions.members.first()
			
			let hist=250
			
			let periodtime="overall"
			let timeperiod="overall"
			try{
				if((args[1].toLowerCase()=='w')||(args[1].toLowerCase()=='week')||(args[1].toLowerCase()=='7')){
					periodtime='7day'
					timeperiod="the week"
				}
				if((args[1].toLowerCase()=='m')||(args[1].toLowerCase()=='month')||(args[1].toLowerCase()=='30')){
					periodtime='1month'
					timeperiod="the month"
				}
				if((args[1].toLowerCase()=='q')||(args[1].toLowerCase()=='quarter')||(args[1].toLowerCase()=='90')){
					periodtime='3month'
					timeperiod="the last 3 months"
				}
				if((args[1].toLowerCase()=='h')||(args[1].toLowerCase()=='half')||(args[1].toLowerCase()=='180')){
					periodtime='6month'
					timeperiod="the last 6 months"
				}
				if((args[1].toLowerCase()=='y')||(args[1].toLowerCase()=='year')||(args[1].toLowerCase()=='365')){
					periodtime='12month'
					timeperiod="the year"
				}				
				if((args[1].toLowerCase()=='a')||(args[1].toLowerCase()=='o')||(args[1].toLowerCase()=='alltime')||(args[1].toLowerCase()=='overall')){
					periodtime='overall'
					timeperiod="overall"
				}
			}catch{
			}
			try{
				if((parseInt(args[args.length-1])>0)&&(parseInt(args[args.length-1])<=1000)){
					hist=parseInt(args[args.length-1])
				}
					
			}catch{}
			
			
			let theirname="";
			if(username2){
				const user2 = await users.findOne({
					where: {
						userID: username2.id
					}
				})
				let lfm1=""
				let lfm2=""					
				try{	
					lfm1=user.username
					lfm2=user2.username
				}catch{
					await message.reply('something went wrong while trying to find one of your last.fm usernames.')
					return
				}				
				//console.log(user.username+" / "+user2.username)
				theirname=user2.username
			}else{
				theirname=args[0];				
			}

				if(user.username==theirname){
					await message.reply('I don\'t think this is going to do what you want it to do.')
					return
				}
			
			const params = stringify({
                method: 'user.gettopartists',                
				user: user.username,
				limit: hist,
				period: periodtime,
                api_key: client.apikey,				
                format: 'json',
            })
            const authorData = await fetch(`${client.url}${params}`).then(r => r.json())
            if (authorData.error) {
                await message.reply("something went wrong with getting info from Last.fm.")
                console.error(authorData);
                return
            }

			const params2 = stringify({
                method: 'user.gettopartists',                
				user: theirname,
				limit: hist,
				period: periodtime,
                api_key: client.apikey,
                format: 'json',
            })
            const userData = await fetch(`${client.url}${params2}`).then(r => r.json())
            if (userData.error) {
                await message.reply("something went wrong with getting info from Last.fm.")
                console.error(userData);
                return
            }
		//let totalmatches=0
		const matches = [];
		/*
		for (const a of userData.topartists.artist) {
			const match = authorData.topartists.artist.find(x => x.name === a.name);
			if (match) {
				//totalmatches++
			  const playcounts = [parseInt(match.playcount), parseInt(a.playcount)];
			  let diff=9999
			  if(match.playcount>=5){				
				diff = difference(...playcounts);
			  }
			  const data = {
				name: match.name,
				authorPlays: match.playcount,
				userPlays: a.playcount,
				difference: diff,
			  };
			  //if (matches.length !== 12) matches.push(data);
			  //else break;
			  matches.push(data);
			}
		}*/
		for (const a of userData.topartists.artist) {
			const match = authorData.topartists.artist.find(x => x.name === a.name);
			if (match) {
				let authorTop=""
				let userTop=""
				if(parseInt(match[`@attr`].rank)<=authorData.topartists.artist.length*0.05){authorTop="*"}
				if(parseInt(a[`@attr`].rank)<=userData.topartists.artist.length*0.05){userTop="*"}
			  const playcounts = [parseInt(match[`@attr`].rank), parseInt(a[`@attr`].rank)];			  
			  const diff = difference(...playcounts);
			  const data = {
				name: match.name,
				authorPlays: match.playcount,
				userPlays: a.playcount,
				authorRank: parseInt(match[`@attr`].rank),
				userRank: parseInt(a[`@attr`].rank),
				authorFave:authorTop,
				userFave:userTop,
				difference: (diff+parseInt(match[`@attr`].rank)+parseInt(a[`@attr`].rank)),
			  };
			  matches.push(data);
			}
		}		
		if (matches.length === 0) {
			await message.reply(`you and ${username2} share no common artists.`);
			return
        }
		matches.sort((a, b) => a.difference - b.difference);
		const tastes=matches.slice(0, 15)
		let starblurb=""
		for(let m=0;m<tastes.length;m++){
			if((tastes[m].authorFave=="*")||(tastes[m].userFave=="*")){
				starblurb="\n\n\* *denotes that the artist is ranked in the user's top 5%.*"
			}
		}
		
		
		let minartists=userData.topartists.artist.length
		if(authorData.topartists.artist.length<minartists){
			minartists=authorData.topartists.artist.length
		}
		const embed = new BotEmbed(message)			
			.setTitle(`${user.username} and ${theirname} taste comparison (top ${minartists} for ${timeperiod})`)
			.setDescription(`**${matches.length} artist(s) found (${parseInt(Math.ceil((matches.length/minartists)*100))}% match), displaying the scrobbles of ${tastes.length} of them:**`+starblurb)
			//.addField('Inline field title', 'Some value here', true)
			/*tastes.forEach(m => {
				let breaker="="
				if(m.authorPlays>m.userPlays){
					breaker=">"
				}
				if(m.authorPlays>m.userPlays){
					breaker="<"
				}
				const comp = `${m.authorPlays} plays ${breaker} ${m.userPlays} plays`;
				embed.addField(`${m.name}`, comp, true);
			});*/
			
			for(let m=0;m<tastes.length;m++){
				
				/*let breaker="="
				if(parseInt(tastes[m].authorPlays)>parseInt(tastes[m].userPlays)){
					breaker=">"
				}
				if(parseInt(tastes[m].authorPlays)<parseInt(tastes[m].userPlays)){
					breaker="<"
				}				
				const comp = `${tastes[m].authorPlays} (#${tastes[m].authorRank}) ${breaker} ${tastes[m].userPlays} (#${tastes[m].userRank})`;
				embed.addField(`${tastes[m].name} (${tastes[m].authorRank-tastes[m].userRank})`, comp, true);
				*/
				let apblurb="plays"
				let upblurb="plays"
				if(parseInt(tastes[m].authorPlays)==1){apblurb="play"}
				if(parseInt(tastes[m].userPlays)==1){upblurb="play"}
				
				const comp = `${tastes[m].authorPlays} ${apblurb}${tastes[m].authorFave} - ${tastes[m].userPlays} ${upblurb}${tastes[m].userFave}`;
				embed.addField(`${tastes[m].name}`, comp, true);				
			}
			

			await message.channel.send(embed);			
			
        }
		

    }

}

module.exports = TasteCommand