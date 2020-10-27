/**
 * tracks per album
 */
const LastFMAPI = require("./api.js");

exports.run = async (client, message, args, user, discorduser) => {
  let dataalbum = await LastFMAPI.getTopAlbums(user, client, message);
  let datatrack = await LastFMAPI.getTopTracks(user, client, message);

  await message.reply(
    `\`${user.username}\` averages **${
      Math.round(
        (datatrack.toptracks["@attr"].total /
          dataalbum.topalbums["@attr"].total) *
          100
      ) / 100
    }** tracks per album.`
  );
};
