/**
 * Returns the Last.fm join date
 */
const LastFMAPI = require("./api.js");

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + " " + month + " " + year;
  return time;
}

exports.run = async (client, message, args, user, discorduser) => {
  let datauser = await LastFMAPI.getInfo(user, client, message);

  await message.reply(
    `\`${user.username}\` has been scrobbling since **${timeConverter(datauser.user.registered["#text"])}**.`
  );
};
