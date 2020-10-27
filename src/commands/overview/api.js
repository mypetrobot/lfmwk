/*
  Common calls to the LastFM API used in all overview commands
*/
const { stringify } = require("querystring");
const fetch = require("node-fetch");

const shipIt = async (fetchURL) => {
  const data = await fetch(fetchURL).then((r) => r.json());
  if (data.error) {
    await message.reply("something went wrong with getting info from Last.fm.");
    console.error(data);
    return;
  }
  return data;
};

const getTopArtists = async ({ username }, { url, apikey }, { error }) => {
  const paramsartist = stringify({
    method: "user.gettopartists",
    user: username,
    api_key: apikey,
    limit: 1000,
    format: "json",
  });
  return await shipIt(`${url}${paramsartist}`, error);
};

const getInfo = async ({ username }, { url, apikey }, { error }) => {
  const paramsuser = stringify({
    method: "user.getinfo",
    user: username,
    api_key: apikey,
    format: "json",
  });
  return await shipIt(`${url}${paramsuser}`, error);
};

const getTopAlbums = async ({ username }, { url, apikey }, { error }) => {
  const paramsalbum = stringify({
    method: "user.gettopalbums",
    user: username,
    api_key: apikey,
    limit: 5,
    format: "json",
  });
  return await shipIt(`${url}${paramsalbum}`, error);
};

const getTopTracks = async ({ username }, { url, apikey }, { error }) => {
  const paramstrack = stringify({
    method: "user.gettoptracks",
    user: username,
    api_key: apikey,
    limit: 5,
    format: "json",
  });
  return await shipIt(`${url}${paramstrack}`, error);
};

module.exports = { getTopArtists, getInfo, getTopAlbums, getTopTracks };
