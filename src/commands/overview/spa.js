/**
 * Average scrobbles per artist
 */
const LastFMAPI = require("./api.js");

exports.run = async (client, message, args, user, discorduser) => {
  let datauser = await LastFMAPI.getInfo(user, client, message);
  let dataartist = await LastFMAPI.getTopArtists(user, client, message);

  await message.reply(`
    \`${user.username}\` averages **${
      Math.round(
        (datauser.user.playcount / dataartist.topartists["@attr"].total) * 100
      ) / 100
    }** scrobbles per artist.`);
};
