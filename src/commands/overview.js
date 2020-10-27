const LastFMAPI = require("./overview/api.js");
const Command = require("../handler/Command");
const BotEmbed = require("../classes/BotEmbed");
const fs = require("fs");
const path = require("path");

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

class OverviewCommand extends Command {
  constructor() {
    super({
      name: "overview",
      description:
        "Displays a general overview of a given user. If no user is specified, the bot will return some info about you. You can request specific stats using the following sub-commands.\n\n**Sub-Commands:**\n"	
	+	"`joined` - The date a user joined last.fm.\n"
	+	"`tl` - Total albums.\n"
	+	"`tt` - Total tracks.\n"	
	+	"`spa` - Average scrobbles per artist.\n"
	+	"`spl` - Average scrobbles per album.\n"
	+	"`spt` - Average scrobbles per track.\n"
	+	"`lpa` - Average albums per artist.\n"	
	+	"`tpa` - Average tracks per artist.\n"	
	+	"`tpl` - Average tracks per album.\n"	
	+	"`hidx` - H-index. \n"
	+	"`sumtop <x>` - Total scrobbles for the user's top X artists. Defaults to top 10.\n"		
	+	"`pcttop <x>` - Percent of a user's total scrobbles for that user's top X artists. Defaults to top 10.\n"	
	+	"`apct <x>` - The number of top artists to reach X% of a user's total scrobbles. Defaults to 50%."	
		,
      usage: [
        "overview",
        "overview @<user>",
        "overview <sub-command>",
		"overview <sub-command> <parameter>",
        "overview @<user> <sub-command>",
		"overview @<user> <sub-command> <parameter>"
      ],
      aliases: ["o"],
    });
  }

  async run(client, message, args) {
    if (message.channel.id == "260438376270921729") {
      return;
    }

    // Get user info, and redirect to subcommand if necessary
    let user;
    let discorduser;
    const { users } = client.models;
    const files = fs.readdirSync(path.join(__dirname, "overview"));
    let overviewcmds = files.map((x) => x.slice(0, x.length - 3));
    overviewcmds = overviewcmds.filter((e) => e !== "api"); // Remove entries that aren't commands
    if (args.length > 0) {
      // subcommand, user == author
      if (overviewcmds.includes(args[0])) {
        discorduser = message.author;
        user = await users.findOne({
          where: {
            userID: message.author.id,
          },
        });

        const command = require(`./overview/${args[0].toLowerCase()}`);
        await command.run(client, message, args, user, discorduser);
        return;
      }
      // subcommand, custom user in args[0]
      else if (overviewcmds.includes(args[1])) {
        try {
          user = await users.findOne({
            where: {
              userID: message.mentions.members.first().id,
            },
          });
          discorduser = message.mentions.members.first();
        } catch {
          user = await users.findOne({
            where: {
              userID: message.author.id,
            },
          });
        }
        const command = require(`./overview/${args[1].toLowerCase()}`);
        await command.run(client, message, args, user, discorduser);
        return;
      }
      // assume normal overview, custom user
      else {
        try {
          user = await users.findOne({
            where: {
              userID: message.mentions.members.first().id,
            },
          });
          discorduser = message.mentions.members.first().user;
        } catch {
          user = await users.findOne({
            where: {
              userID: message.author.id,
            },
          });
        }
      }
    }
    // assume normal overview, user == author
    else {
      discorduser = message.author;
      user = await users.findOne({
        where: {
          userID: message.author.id,
        },
      });
    }

    // calculate section five
    const crowns2 = await client.models.crowns.findAll({
      where: {
        guildID: message.guild.id,
      },
    });
    const amounts = new Map();
    crowns2.forEach((x) => {
      if (amounts.has(x.userID)) {
        let amount = amounts.get(x.userID);
        amounts.set(x.userID, ++amount);
      } else {
        amounts.set(x.userID, 1);
      }
    });
    let BoardLocation = -1;
    let crowntotal = 0;
    const entries = [...amounts.entries()];
    const fullentries = entries.sort(([_, a], [__, b]) => b - a);
    for (let q = 0; q < fullentries.length; q++) {
      try{
	  if (fullentries[q][0] === discorduser.id) {
        BoardLocation = q + 1;
        crowntotal = fullentries[q][1];
      }
	  }catch{
		  await message.reply(`I think you passed an invalid parameter or sub-command.`)
		  return
	  }
    }

    // api calls
    let dataartist = await LastFMAPI.getTopArtists(user, client, message);
    let datauser = await LastFMAPI.getInfo(user, client, message);
    let dataalbum = await LastFMAPI.getTopAlbums(user, client, message);
    let datatrack = await LastFMAPI.getTopTracks(user, client, message);

    // Calculate section
    // -----------------------------------------------------------------------
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

    // calculate text for chunk 4
    // -----------------------------------------------------------------------
    let scrobsums = "";
    if (plus100 > 0) {
      scrobsums =
        "\n\n**Among their top 1000 artists, " + user.username + " has...**\n";
      if (plus10000 > 0) {
        scrobsums += "- " + plus10000 + " artist";
        if (plus10000 != 1) {
          scrobsums += "s";
        }
        scrobsums += " with 10000+ scrobbles\n";
      }
      if (plus5000 > 0) {
        scrobsums += "- " + plus5000 + " artist";
        if (plus5000 != 1) {
          scrobsums += "s";
        }
        scrobsums += " with 5000+ scrobbles\n";
      }
      if (plus1000 > 0) {
        scrobsums += "- " + plus1000 + " artist";
        if (plus1000 != 1) {
          scrobsums += "s";
        }
        scrobsums += " with 1000+ scrobbles\n";
      }
      if (plus500 > 0) {
        scrobsums += "- " + plus500 + " artist";
        if (plus500 != 1) {
          scrobsums += "s";
        }
        scrobsums += " with 500+ scrobbles\n";
      }
      if (plus250 > 0) {
        scrobsums += "- " + plus250 + " artist";
        if (plus250 != 1) {
          scrobsums += "s";
        }
        scrobsums += " with 250+ scrobbles\n";
      }
      if (plus100 > 0) {
        scrobsums += "- " + plus100 + " artist";
        if (plus100 != 1) {
          scrobsums += "s";
        }
        scrobsums += " with 100+ scrobbles";
      }
    }
    if (BoardLocation == -1) {
      BoardLocation = "N/A";
    } else {
      BoardLocation = "#" + BoardLocation;
    }

    // -----------------------------------------------------------------------

    let description =
      "**Username:** [" +
      datauser.user.name +
      "](" +
      datauser.user.url +
      ") " +
      "*(scrobbling since " +
      timeConverter(datauser.user.registered["#text"]) +
      ")*\n" +
      "**Country:** " +
      datauser.user.country +
      "\n" +
      "**Scrobbles:** " +
      datauser.user.playcount +
      " | " +
      "**Avg/Day:** " +
      Math.round(
        (datauser.user.playcount /
          ((Math.floor(Date.now() / 1000) -
            parseInt(datauser.user.registered["#text"])) /
            86400)) *
          100
      ) /
        100 +
      "\n" +
      "**Artists:** " +
      dataartist.topartists["@attr"].total +
      " | " +
      "**Avg/Artist:** " +
      Math.round(
        (datauser.user.playcount / dataartist.topartists["@attr"].total) * 100
      ) /
        100 +
      "\n" +
      "**Albums:** " +
      dataalbum.topalbums["@attr"].total +
      " | " +
      "**Avg/Album:** " +
      Math.round(
        (datauser.user.playcount / dataalbum.topalbums["@attr"].total) * 100
      ) /
        100 +
      "\n" +
      "**Tracks:** " +
      datatrack.toptracks["@attr"].total +
      " | " +
      "**Avg/Track:** " +
      Math.round(
        (datauser.user.playcount / datatrack.toptracks["@attr"].total) * 100
      ) /
        100 +
      "\n\n" +
      "**Albums per artist:** " +
      Math.round(
        (dataalbum.topalbums["@attr"].total /
          dataartist.topartists["@attr"].total) *
          100
      ) /
        100 +
      "\n" +
      "**Tracks per artist:** " +
      Math.round(
        (datatrack.toptracks["@attr"].total /
          dataartist.topartists["@attr"].total) *
          100
      ) /
        100 +
      "\n" +
      "**Tracks per album:** " +
      Math.round(
        (datatrack.toptracks["@attr"].total /
          dataalbum.topalbums["@attr"].total) *
          100
      ) /
        100 +
      "\n\n" +
      "**H-Index:** " +
      hindex +
      "\n" +
      "**# of artists to equal 50% of scrobbles:** Top " +
      halfpoint +
      "\n" +
      "**Total scrobbles for top 10 artists:** " +
      top10scrob +
      "\n" +
      "*" +
      user.username +
      "'s top 10 artists account for **" +
      Math.round((top10scrob / datauser.user.playcount) * 100 * 100) / 100 +
      "%** of their total scrobbles.*" +
      scrobsums +
      "\n\n" +
      "**Total Crowns:** " +
      crowntotal +
      " *(Ranked " +
      BoardLocation +
      ")*\n" +
      "*" +
      user.username +
      " has **" +
      elig +
      "** artists with 30+ plays in their top " +
      dataartist.topartists.artist.length +
      " artists.*" +
      "\n\n" +
      "**" +
      user.username +
      "'s top 3 artists by scrobble count:**";

    // Extended embed
    const embed = new BotEmbed(message)
      .setDescription(description)
      .setAuthor(
        `Scrobbler Overview: ${discorduser.username}`,
        discorduser.avatarURL,
        datauser.user.url
      )
      .setThumbnail(datauser.user.image[2]["#text"])
      .addField("#1", dataartist.topartists.artist[0].name, true)
      .addField("Scrobbles", dataartist.topartists.artist[0].playcount, true)
      .addField(
        "Percent",
        Math.round(
          (dataartist.topartists.artist[0].playcount /
            datauser.user.playcount) *
            100 *
            100
        ) /
          100 +
          "%",
        true
      )
      .addField("#2", dataartist.topartists.artist[1].name, true)
      .addField("Scrobbles", dataartist.topartists.artist[1].playcount, true)
      .addField(
        "Percent",
        Math.round(
          (dataartist.topartists.artist[1].playcount /
            datauser.user.playcount) *
            100 *
            100
        ) /
          100 +
          "%",
        true
      )
      .addField("#3", dataartist.topartists.artist[2].name, true)
      .addField("Scrobbles", dataartist.topartists.artist[2].playcount, true)
      .addField(
        "Percent",
        Math.round(
          (dataartist.topartists.artist[2].playcount /
            datauser.user.playcount) *
            100 *
            100
        ) /
          100 +
          "%",
        true
      );

    // ship it!
    await message.channel.send(embed);
  }
}

module.exports = OverviewCommand;
