/**
 * sumpct (artists to equal 50% of scrobbles)
 */
function plur(str,num){if(num!=1){return str+"s"}else{return str}}
function revplur(str,num){if(num==1){return str+"s"}else{return str}}

const LastFMAPI = require("./api.js");

exports.run = async (client, message, args, user, discorduser) => {
	
	let checker	
	checker=parseFloat(args[args.length-1])

	if(isNaN(checker)){
		checker=50
	}
	if((checker<1)||(checker>100)){
		await message.reply('I only support 1% to 100%.')
		return
	}
	  let top10scrob = 0;
 
  let dataartist = await LastFMAPI.getTopArtists(user, client, message);
  let datauser = await LastFMAPI.getInfo(user, client, message);
  let targetscrobbles = parseInt(datauser.user.playcount) * (checker/100);
  let totalartists = -1;

  for (let z = 0; z < dataartist.topartists.artist.length; z++) {
      top10scrob += parseInt(dataartist.topartists.artist[z].playcount);
	  if((totalartists==-1)&&(top10scrob>=targetscrobbles)){
		  totalartists=z+1
		  break
	  }
  }
	if(totalartists!=-1){		
	   await message.reply(
		`it takes scrobbles from \`${user.username}\`'s top **${totalartists}** ${plur('artist',totalartists)} to equal **${checker}%** of their total scrobbles.`
	  );
	}else{
		await message.reply(
		`it takes scrobbles from more than \`${user.username}\`'s top **1000** artists to equal **${checker}%** of their total scrobbles.`
	  );
	}
	
};