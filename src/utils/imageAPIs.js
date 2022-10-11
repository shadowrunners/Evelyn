const { get } = require("superagent");

async function nekoFetch(action, member, text) {
  const { body } = await get(
    `https://nekobot.xyz/api/imagegen?type=${action}&username=${member}&text=${text}`
  );
  return body.message;
}

async function waifuFetch(action) {
  const { body } = await get(`https://api.waifu.pics/sfw/${action}`);
  return body.url;
}

module.exports = {
  nekoFetch,
  waifuFetch,
};
