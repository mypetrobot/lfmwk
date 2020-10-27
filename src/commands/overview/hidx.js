/**
 * hidk (h-index)
 */
const LastFMAPI = require("./api.js");

exports.run = async (client, message, args, user, discorduser) => {
  let dataartist = await LastFMAPI.getTopArtists(user, client, message);
  let datauser = await LastFMAPI.getInfo(user, client, message);

  let elig = 0;
  let top10scrob = 0;

  let plus100 = 0;
  let plus250 = 0;
  let plus500 = 0;
  let plus1000 = 0;
  let plus5000 = 0;
  let plus10000 = 0;

  let halfscrobs = parseInt(datauser.user.playcount) / 2;
  let tohalf = 0;
  let halfpoint = -1;
  let hindex = -1;

  for (let z = 0; z < dataartist.topartists.artist.length; z++) {
    tohalf = tohalf + parseInt(dataartist.topartists.artist[z].playcount);
    if (tohalf >= halfscrobs && halfpoint == -1) {
      halfpoint = z + 1;
    }
    if (parseInt(dataartist.topartists.artist[z].playcount) >= z + 1) {
      hindex = z + 1;
    }
    if (z < 10) {
      top10scrob += parseInt(dataartist.topartists.artist[z].playcount);
    }
    if (dataartist.topartists.artist[z].playcount >= 30) {
      elig++;
    }
    if (dataartist.topartists.artist[z].playcount >= 100) {
      plus100++;
    }
    if (dataartist.topartists.artist[z].playcount >= 250) {
      plus250++;
    }
    if (dataartist.topartists.artist[z].playcount >= 500) {
      plus500++;
    }
    if (dataartist.topartists.artist[z].playcount >= 1000) {
      plus1000++;
    }
    if (dataartist.topartists.artist[z].playcount >= 5000) {
      plus5000++;
    }
    if (dataartist.topartists.artist[z].playcount >= 10000) {
      plus10000++;
    }
  }
  if (halfpoint == -1) {
    halfpoint = "1000+";
  }

  await message.reply(`\`${user.username}\`'s h-index is **${hindex}**.`);
};
