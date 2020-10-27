const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

function plur(str,num){if(num!=1){return str+"s"}else{return str}}

class RankArtistCommand extends Command {

    constructor() {
        super({
            name: 'rankartist',
            description: 'Shows the artist at a specified rank for the user\'s overall time period.',
            usage: [   
                'rankartist <number>'
            ],
            aliases: ['ra']
        })
    }

    async run(client, message, args) {
		const { bans, users, crowns } = client.models
		const user = await users.findOne({
            where: {
                userID: message.author.id
            }
        })
        
        if (args.length > 0) {
			let page=parseInt((parseInt(args[0])/1000)+1)
			//console.log(page)
			let ranknumber=parseInt(args[0])-((page-1)*1000)-1
			//console.log(ranknumber)
			if((page!=1)&&(ranknumber==-1)){
				page=page-1
				ranknumber=999
			}
			if((ranknumber>-1)){
				try{				
					const params2 = stringify({
						method: 'user.gettopartists',						
						user: user.username,
						limit: 1000,
						page: page,
						api_key: client.apikey,
						format: 'json',
					})
					const data2 = await fetch(`${client.url}${params2}`).then(r => r.json())
					if (data2.error) {
						await message.reply("something went wrong with getting info from Last.fm.")
						console.error(data2);
						return
					} else {
						await message.reply("**"+data2.topartists.artist[ranknumber].name+"** is ranked **#"+(parseInt(args[0]))+"** on your all-time top artists list with **"+data2.topartists.artist[ranknumber].playcount+"** "+plur("play",+parseInt(data2.topartists.artist[ranknumber].playcount))+".")		
					}
				}catch(err) {
					await message.reply('you don\'t appear to have an artist ranked at **#'+(parseInt(args[0]))+'**.')
				}
			}else{
				await message.reply('"'+args[0]+'" is an invalid rank.')
			}
        } else {
            await message.reply('you need to specify a rank #.')
        }
    }

}

module.exports = RankArtistCommand