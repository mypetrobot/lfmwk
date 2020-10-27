/**
 * Scrobbles per album
 */
const LastFMAPI = require("./api.js");

exports.run = async (client, message, args, user, discorduser) => {
  let datauser = await LastFMAPI.getInfo(user, client, message);
  let dataalbum = await LastFMAPI.getTopAlbums(user, client, message);

  await message.reply(
    `\`${user.username}\` averages **${
      Math.round(
        (datauser.user.playcount / dataalbum.topalbums["@attr"].total) * 100
      ) / 100
    }** scrobbles per album.`
  );
};
