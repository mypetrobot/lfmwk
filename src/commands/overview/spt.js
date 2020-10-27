/**
 * Average scrobbles per artist
 */
const LastFMAPI = require("./api.js");

exports.run = async (client, message, args, user, discorduser) => {
  let datauser = await LastFMAPI.getInfo(user, client, message);
  let datatrack = await LastFMAPI.getTopTracks(user, client, message);

  await message.reply(`
   \`${user.username}\` averages **${
    Math.round(
      (datauser.user.playcount / datatrack.toptracks["@attr"].total) * 100
    ) / 100
  }** scrobbles per track.`);
};
