const { get } = require("superagent");

module.exports = {
  awooify: async (user1, user2) => {
    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=awooify&url=${avatar}`
    );
    return body.message;
  },
  baguette: async (user1, user2) => {
    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=baguette&url=${avatar}`
    );
    return body.message;
  },
  blurpify: async (user1, user2) => {
    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=blurpify&image=${avatar}`
    );
    return body.message;
  },
  captcha: async (user1, user2) => {
    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const username = user1?.username || user2?.username;
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=captcha&url=${avatar}&username=${username}`
    );
    return body.message;
  },
  changemymind: async (text) => {
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`
    );
    return body.message;
  },
  deepfry: async (user1, user2) => {
    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=deepfry&image=${avatar}`
    );
    return body.message;
  },
  kannagen: async (text) => {
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=kannagen&text=${text}`
    );
    return body.message;
  },
  phcomment: async (user1, user2, text) => {
    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const username = user1?.username || user2?.username;
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=phcomment&username=${username}&image=${avatar}&text=${text}`
    );
    return body.message;
  },
  ship: async (user1, user2) => {
    const avatar = user1?.avatarURL();
    const avatar2 = user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=ship&user1=${avatar}&user2=${avatar2}`
    );
    return body.message;
  },
  threats: async (user1, user2) => {
    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=threats&url=${avatar}`
    );
    return body.message;
  },
  trash: async (user1, user2) => {
    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=trash&url=${avatar}`
    );
    return body.message;
  },
  trumptweet: async (text) => {
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=trumptweet&text=${text}`
    );
    return body.message;
  },
  tweet: async (user1, user2, text) => {
    const username = user1?.username || user2?.username;
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=tweet&username=${username}&text=${text}`
    );
    return body.message;
  },
  whowouldwin: async (user1, user2) => {
    const member = user1?.avatarURL();
    const member2 = user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=whowouldwin&user1=${member}&user2=${member2}`
    );
    return body.message;
  },
};
