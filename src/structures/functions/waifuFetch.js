// Fetches images from the waifu.pics API.
// Also simplifies the emotions command as a whole since this function manages the API fetching.
const { get } = require("superagent");

async function waifuFetch(action) {
  const { body } = await get(`https://api.waifu.pics/sfw/${action}`);
  return body.url;
}

module.exports = { waifuFetch };
