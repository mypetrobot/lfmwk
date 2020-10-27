/**
 * albums per artist
 */
const LastFMAPI = require("./api.js");

exports.run = async (client, message, args, user, discorduser) => {
  let dataalbum = await LastFMAPI.getTopAlbums(user, client, message);
  let dataartist = await LastFMAPI.getTopArtists(user, client, message);

  await message.reply(
    `\`${user.username}\` listens to an average of **${
      Math.round(
        (dataalbum.topalbums["@attr"].total /
          dataartist.topartists["@attr"].total) *
          100
      ) / 100
    }** albums per artist.`
  );
};
