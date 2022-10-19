const { get } = require("superagent");
const { EmbedBuilder } = require("discord.js");
const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
const { checkUsername, checkText, checkAvatar } = require("./imageHelper.js");

module.exports = {
  awooify: async (user1, user2, interaction) => {
    if (checkUsername(user1, user2, interaction)) return;

    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=awooify&url=${avatar}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
  baguette: async (user1, user2, interaction) => {
    if (checkAvatar(user1, user2, interaction)) return;

    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=baguette&url=${avatar}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
  blurpify: async (user1, user2, interaction) => {
    if (checkAvatar(user1, user2, interaction)) return;

    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=blurpify&image=${avatar}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
  captcha: async (user1, user2, interaction) => {
    if (
      checkAvatar(user1, user2, interaction) ||
      checkUsername(user1, user2, interaction)
    )
      return;

    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const username = user1?.username || user2?.username;
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=captcha&url=${avatar}&username=${username}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
  changemymind: async (text, interaction) => {
    if (checkText(text, interaction)) return;

    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
  deepfry: async (user1, user2, interaction) => {
    if (checkAvatar(user1, user2, interaction)) return;

    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=deepfry&image=${avatar}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
  kannagen: async (text, interaction) => {
    if (checkText(text, interaction)) return;

    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=kannagen&text=${text}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
  phcomment: async (user1, user2, text) => {
    if (
      checkAvatar(user1, user2, interaction) ||
      checkUsername(user1, user2, interaction) ||
      checkText(text, interaction)
    )
      return;

    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const username = user1?.username || user2?.username;
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=phcomment&username=${username}&image=${avatar}&text=${text}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
  ship: async (user1, user2, interaction) => {
    if (checkAvatar(user1, user2, interaction)) return;

    const avatar = user1?.avatarURL();
    const avatar2 = user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=ship&user1=${avatar}&user2=${avatar2}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
  threats: async (user1, user2, interaction) => {
    if (checkAvatar(user1, user2, interaction)) return;

    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=threats&url=${avatar}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
  trash: async (user1, user2, interaction) => {
    if (checkAvatar(user1, user2, interaction)) return;

    const avatar = user1?.avatarURL() || user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=trash&url=${avatar}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
  trumptweet: async (text, interaction) => {
    if (checkText(text, interaction)) return;

    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=trumptweet&text=${text}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
  tweet: async (user1, user2, text, interaction) => {
    if (
      checkUsername(user1, user2, interaction) ||
      checkText(text, interaction)
    )
      return;

    const username = user1?.username || user2?.username;
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=tweet&username=${username}&text=${text}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
  whowouldwin: async (user1, user2, interaction) => {
    if (checkAvatar(user1, user2, interaction)) return;

    const member = user1?.avatarURL();
    const member2 = user2?.avatarURL();
    const { body } = await get(
      `https://nekobot.xyz/api/imagegen?type=whowouldwin&user1=${member}&user2=${member2}`
    );

    return interaction.editReply({ embeds: [embed.setImage(body.message)] });
  },
};
