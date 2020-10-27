const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')
const BotEmbed = require('../classes/BotEmbed')

const ENGLISH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '&-.,*";

var fs = require('fs');

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "k", "m", "b", "t" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    return number;
}

function stringIsEnglish(str) {
    var index;

    for (index = str.length - 1; index >= 0; --index) {
        if (ENGLISH.indexOf(str.substring(index, index + 1)) < 0) {
            return false;
        }
    }
    return true;
}
function scramble(a){a=a.split("");for(var b=a.length-1;0<b;b--){var c=Math.floor(Math.random()*(b+1));d=a[b];a[b]=a[c];a[c]=d}return a.join("");}

class JumbleCommand extends Command {

    constructor() {
        super({
            name: 'jumble',
            description: 'A game that jumbles an artist name selected at random.',            
			usage: [
                'jumble', 
                'jumble <guess>', 
				'jumble !hint',
                'jumble !giveup',
                'jumble !hard',
                'jumble !me'
            ],
			aliases: ['j']
        })
    }

    async run(client, message, args) {	
	if((message.channel.id==client.jumblechannel)||(client.jumblechannel=="")){
			let JumbleBand=""

				await fs.readFile('jumble.txt', function read(err, data) {
					if (err) {
							fs.writeFile('jumble.txt', '', function (err) {
							if (err) throw err;
							console.log('No jumble file, made one!');
						}); 
					}else{
						JumbleBand = String(data);
						console.log("  Cur: "+JumbleBand);
					}
				});

			const { bans, users, crowns } = client.models
			const allusers = await client.models.users.findAll()
			let choosing=true
			let artistName
			let selecteduser
			let username
			let user
			let selectedartist
			let data
			let data2
			let tries=0;
			let artistperiod
			let artistperiodstr
			let periodesc
			let periodlimit
			let errcheck
			let guess=""
			let listhresh=10000
			let listhreshtop
			let meuser
			let selfjumble=false
			guess=args.join(" ").toUpperCase().trim()
			switch (guess) {
				case client.prefix+"HARD":
					listhresh=0
					listhreshtop=300000
					break
				case client.prefix+"ME":
					listhresh=0
					meuser = await users.findOne({
						where: {
							userID: message.author.id
						}
					})
					selfjumble=true			
					break
			}
			await sleep(100)
			if ((guess.length > 0)&&(listhresh!=0)&&(!selfjumble)) {

					//guess=args.join(" ").toUpperCase()
					console.log("Guess: "+guess)
					//await message.reply("args: "+args+" | "+args.join(" ")+"\nglob: "+JumbleBand)
					if(String(guess).trim()==String(JumbleBand).trim()){
						//console.log("G Cur: "+JumbleBand)
						await message.react('✅')
						await message.reply("you are correct! The artist was `"+JumbleBand+"`.")
					}
					if(String(guess).trim()==client.prefix+"GIVEUP"){
						await message.reply("The artist was `"+JumbleBand+"`.")
					}
					if(String(guess).trim()==client.prefix+"HINT"){
						let PreScramble = (JumbleBand.toString()).split(" ")
						let TheScramble=""
						let hints=""
						let cor
						let counter=0
						do{							
							hints=""
							TheScramble=""
							for (let i=0;i<PreScramble.length;i++){
								TheScramble+=(scramble(PreScramble[i])+" ")
							}					
							cor=0
							for (let i=0;i<TheScramble.length;i++){
								if(TheScramble.substr(i, 1)==" "){
									hints+=" "
								}else{
									if(JumbleBand.substr(i, 1)==TheScramble.substr(i, 1)){
										hints+=(TheScramble.substr(i, 1))
										cor=cor+1
									}else{
										//hints+=(TheScramble.substr(i, 1))
										hints+="-"
									}
								}
							}
							counter++
							if (counter>50){
								await message.reply('something went wrong while attempting to create a hint.')
								return
							}
						}while((cor<2)||(cor>(JumbleBand.trim().length-PreScramble.length-1)))
						//hints=hints.replace("****","**")
						let msg=
							"In the following jumble, "+cor+" letters that are in their correct locations are shown on the next line:\n\n"+
							"`"+TheScramble.trim()+"`\n`"+hints.trim()+"`\n"
						const embed = new BotEmbed(message)
							.setTitle('Can You Solve This Artist Name Jumble?')
							.setDescription(msg)					
						await message.channel.send(embed)
					}
					
					if((String(guess).trim()==String(JumbleBand).trim())||(String(guess)==client.prefix+"GIVEUP")){
						await fs.writeFile('jumble.txt', '', function (err) {
							if (err) throw err;
							console.log('Replaced jumble file with nothingness');
						}); 				
					}
					if((String(guess).trim()!=String(JumbleBand).trim())&&(String(guess)!=client.prefix+"GIVEUP")&&(String(guess)!=client.prefix+"HINT")&&(String(JumbleBand).trim()!="")){
						let respface=Math.floor(Math.random()*8)
						switch (respface) {
								case 0:
									await message.react('😦')
									break
								case 1:
									await message.react('😩')
									break
								case 2:
									await message.react('😫')
									break
								case 3:
									await message.react('😠')
									break								
								case 4:
									await message.react('😞')
									break								
								case 5:
									await message.react('😧')
									break				
								case 6:
									await message.react('😖')
									break
								case 7:
									await message.react('😓')
									break									
								default:
									await message.react('😦')
						}
					}
			}else{
				if(JumbleBand==""){
					if((listhresh==0)&&(selfjumble==false)){
						await message.channel.send("*I'm finding a new artist to jumble that will hopefully be more difficult...*")
					}else{
						if(selfjumble){
							await message.channel.send("*I'm finding an artist from **"+ message.guild.members.cache.get(meuser.userID).user.username+"'s** library to jumble...*")
						}else{
							await message.channel.send("*I'm finding a new artist to jumble...*")
						}
					}
					while (choosing){
						errcheck=false;
						if(selfjumble){
							artistperiod=Math.floor(Math.random() * 2)
						}else{
							artistperiod=Math.floor(Math.random() * 7)
						}
						switch (artistperiod) {
							case 0:
								artistperiodstr="overall"
								periodesc="overall"
								periodlimit=1000
								break
							case 1:
								periodesc="over the last 12 months"
								periodlimit=1000
								artistperiodstr="12month" 
								break
							case 2:
								periodesc="over the last 3 months"
								periodlimit=1000
								artistperiodstr="3month" 
								break
							case 3:
								periodesc="over the last 6 months"
								periodlimit=1000
								artistperiodstr="6month" 
								break							
							case 4:
								periodesc="over the last month"
								periodlimit=1000
								artistperiodstr="1month" 
								break							
							case 5:
								periodesc="over the last week"
								periodlimit=1000
								artistperiodstr="7day" 
								break							
							case 6:
								periodesc="overall"
								periodlimit=1000
								artistperiodstr="overall"
								break								
							default:
								periodesc="overall"
								periodlimit=1000
								artistperiodstr="overall"
						}
						if(selfjumble){
							username=meuser.username
							user= message.guild.members.cache.get(meuser.userID).user.username
						}else{
							selecteduser=Math.floor(Math.random() * allusers.length)
							username=allusers[selecteduser].username
							user =  message.guild.members.cache.get(allusers[selecteduser].userID).user.username
						}
						//user = await client.fetchUser(allusers[selecteduser].userID)
						
						
						// Grab a top artist.			
						const params = stringify({
							method: 'user.gettopartists',
							user: username,
							limit: periodlimit,
							period: artistperiodstr,
							api_key: client.apikey,
							format: 'json',
						})
						data = await fetch(`${client.url}${params}`).then(r => r.json())
						try{
							selectedartist = Math.floor(Math.random() * data.topartists.artist.length)
						}catch(err) {
							console.log("Artist probably outside of range")
							errcheck=true;
						}
						if(!errcheck){
							if (data.error) {
								await message.reply('something went wrong with getting info from Last.fm.')
								console.error(data)
								choosing=false
								return
							} else {
								artistName = data.topartists.artist[selectedartist].name.toUpperCase()
							}

							// Get some more info on this artist.
							const params2 = stringify({
								method: 'artist.getinfo',
								artist: artistName,
								api_key: client.apikey,
								format: 'json',
							})
							data2 = await fetch(`${client.url}${params2}`).then(r => r.json())			
							
							if (data2.error) {
								await message.reply('something went wrong with getting info from Last.fm.')
								console.error(data2)
								choosing=false
								return
							}
							if((artistName.indexOf("é")!=-1)||(artistName.indexOf("É")!=-1)){
								artistName=artistName.replace("é","e")
								artistName=artistName.replace("É","E")
							}
							if(
								(artistName.length>4)&&
								(artistName.length<36)&&
								(data2.artist.stats.listeners>listhresh)&&
								(stringIsEnglish(artistName))
							){
								if((listhresh==0)&&(selfjumble==false)){
									if(data2.artist.stats.listeners<listhreshtop){
										choosing=false
									}
								}else{
									choosing=false
								}
							}
						}
						tries++
						if(tries>50){
							await message.reply('something went horribly wrong here, sorry.')
							console.error(data)
							choosing=false
							return
						}
					}
				
					//console.log(artistName)
					await fs.writeFile('jumble.txt', artistName, function (err) {
						if (err) throw err;
						console.log('Replaced jumble file with '+artistName);
						}); 
					let PreScramble = (artistName.toString()).split(" ")
					let TheScramble=""
					for (let i=0;i<PreScramble.length;i++){
						TheScramble+=(scramble(PreScramble[i])+" ")
					}	
					
					let msg=
						"Who is this artist?\n\n"+
						"`"+TheScramble.trim()+"`\n\n"+			
						"**Hints:**\n*This artist has **"+abbrNum(data2.artist.stats.listeners,1)+"** listeners on last.fm and **"+
						user+"** has scrobbled them **"+data.topartists.artist[selectedartist].playcount+"** times "+periodesc+" (#"+data.topartists.artist[selectedartist]['@attr'].rank+" on their top artists list for that period)."
					try{	
						msg+="This artist is tagged as \""+data2.artist.tags.tag[0].name+"\""
					}catch(err) {
					}
					try{	
						msg+=" as well as \""+data2.artist.tags.tag[1].name+"\""
					}catch(err) {
					}
					msg+=". "
					try{			
						msg+="Last.fm considers **"+data2.artist.similar.artist[0].name+"**"
					}catch(err) {
					}
					try{	
						msg+=" and **"+data2.artist.similar.artist[1].name+"**"
					}catch(err) {
					}
					msg+=" to be similar."		
					msg+="*"
					//msg+="\n\n**Answer:**\n*||**"+data.topartists.artist[selectedartist].name+"**||*\n"
					const embed = new BotEmbed(message)
						.setTitle('Can You Solve This Artist Name Jumble?')
						.setDescription(msg)					
					await message.channel.send(embed)
				}else{
					let PreScramble = (JumbleBand.toString()).split(" ")
					let TheScramble=""
					for (let i=0;i<PreScramble.length;i++){
						TheScramble+=(scramble(PreScramble[i])+" ")
					}	
					
					let msg=
						"I've reshuffled the letters, now who is this artist?\n\n"+
						"`"+TheScramble.trim()+"`\n\n"
					const embed = new BotEmbed(message)
						.setTitle('Can You Solve This Artist Name Jumble?')
						.setDescription(msg)					
					await message.channel.send(embed)
				}
			}
		}else{
			await message.react('❌')
		}
    }

}

module.exports = JumbleCommand