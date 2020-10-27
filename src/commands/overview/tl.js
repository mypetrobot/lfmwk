/**
 * Total albums
 */
const LastFMAPI = require("./api.js");

exports.run = async (client, message, args, user, discorduser) => {
  let dataalbum = await LastFMAPI.getTopAlbums(user, client, message);

  await message.reply(
    `\`${user.username}\` has scrobbled tracks from **${dataalbum.topalbums["@attr"].total}** total albums.`
  );
};
