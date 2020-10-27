const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class RandomSongCommand extends Command {

    constructor() {
        super({
            name: 'randomsong',
            description: 'Returns a random song scrobbled by a random user on the server.',
            usage: ['randomsong']
        })
    }

    async run(client, message, args) {
		//const Op = Sequelize.Op
		const { bans, users, crowns } = client.models
		const guild = await message.guild.fetchMembers()
		let allusers=[]
            for (const [id, member] of guild.members) {
                const user = await users.findOne({
                    where: {
                        userID: id
                    }
                })
                if (!user) {
                    continue
                }else{
					allusers.push({
						lfm: user.username,
						uid: id
					})
				}
            }
		const rnduser=Math.floor(Math.random() * allusers.length)
		const theusername=allusers[rnduser].lfm
		const discorduser=await client.fetchUser(allusers[rnduser].uid)
		let track=""
		let artist=""
		if(Math.random()<.4){
			const params = stringify({
				method: 'user.getrecenttracks',
				user: theusername,
				limit: 200,
				api_key: client.apikey,
				format: 'json'			
			})
			const data = await fetch(`${client.url}${params}`).then(r => r.json())
			if (data.error) {
				await message.reply('something went wrong with getting info from Last.fm.')
				console.error(data);
				return
			}
			const rndtrack=Math.floor(Math.random() * data.recenttracks.track.length)
			track=data.recenttracks.track[rndtrack].name
			artist=data.recenttracks.track[rndtrack].artist["#text"]
		}else{
			const artistperiod=Math.floor(Math.random() * 6)
			let artistperiodstr=""
			let periodesc=""
					switch (artistperiod) {
						case 0:
							artistperiodstr="overall"
							periodesc="overall"
							break
						case 1:
							periodesc="over the last 3 months"
							artistperiodstr="3month" 
							break
						case 2:
							periodesc="over the last 6 months"
							artistperiodstr="6month" 
							break
						case 3:
							periodesc="over the last 12 months"
							artistperiodstr="12month" 
							break
						case 4:
							periodesc="over the last month"
							artistperiodstr="1month" 
							break							
						case 5:
							periodesc="over the last week"
							artistperiodstr="7day" 
							break													
						default:
							periodesc="overall"
							artistperiodstr="overall"
					}
			const params = stringify({
				method: 'user.gettoptracks',
				user: theusername,
				limit: 1000,
				period: artistperiodstr,
				api_key: client.apikey,
				format: 'json'			
			})
			const data = await fetch(`${client.url}${params}`).then(r => r.json())
			if (data.error) {
				await message.reply('something went wrong with getting info from Last.fm.')
				console.error(data);
				return
			}
			const rndtrack=Math.floor(Math.random() * data.toptracks.track.length)
			track=data.toptracks.track[rndtrack].name
			artist=data.toptracks.track[rndtrack].artist.name			
		}
		
		await message.reply("here's a random song: `"+track+"` by `" + artist + "` *(scrobbled by "+discorduser.username+")*")
		
    }

}

module.exports = RandomSongCommand