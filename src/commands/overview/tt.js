/**
 * Total tracks
 */
const LastFMAPI = require("./api.js");

exports.run = async (client, message, args, user, discorduser) => {
  let datatrack = await LastFMAPI.getTopTracks(user, client, message);

  await message.reply(
    `\`${user.username}\` has scrobbled **${datatrack.toptracks["@attr"].total}** total individual tracks.`
  );
};
