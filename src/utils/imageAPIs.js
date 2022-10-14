const { get } = require("superagent");

async function nekoFetch(action, member, text) {
  const { body } = await get(
    `https://nekobot.xyz/api/imagegen?type=${action}&username=${member}&text=${text}`
  );
  return body.message;
}

module.exports = {
  nekoFetch,
};
