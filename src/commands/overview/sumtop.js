/**
 * Total scrobbles for top 10 artists
 */
function plur(str,num){if(num!=1){return str+"s"}else{return str}}
function revplur(str,num){if(num==1){return str+"s"}else{return str}}

const LastFMAPI = require("./api.js");

exports.run = async (client, message, args, user, discorduser) => {
	
	let checker	
	checker=parseInt(args[args.length-1])

	if(isNaN(checker)){
		checker=10
	}
	if((checker<1)||(checker>1000)){
		await message.reply('I only support top artists 1-1000.')
		return
	}
	
  let dataartist = await LastFMAPI.getTopArtists(user, client, message);
  //let datauser = await LastFMAPI.getInfo(user, client, message);

  let top10scrob = 0;	  

  for (let z = 0; z < checker; z++) {
      top10scrob += parseInt(dataartist.topartists.artist[z].playcount);
  }
if(checker!=1){
  await message.reply(
    `the sum of \`${user.username}\`'s top **${checker}** ${plur('artist',checker)} is equal to **${top10scrob}** ${plur('scrobble',top10scrob)}.`
  );
}else{
  await message.reply(
    `\`${user.username}\`'s has **${top10scrob}** ${plur('scrobble',top10scrob)} of their top artist.`
  );	
}
};