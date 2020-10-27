/**
 * tracks per artist
 */
const LastFMAPI = require("./api.js");

exports.run = async (client, message, args, user, discorduser) => {
  let datatrack = await LastFMAPI.getTopTracks(user, client, message);
  let dataartist = await LastFMAPI.getTopArtists(user, client, message);

  await message.reply(
    `\`${user.username}\` averages **${
      Math.round(
        (datatrack.toptracks["@attr"].total /
          dataartist.topartists["@attr"].total) *
          100
      ) / 100
    }** tracks per artist.`
  );
};
