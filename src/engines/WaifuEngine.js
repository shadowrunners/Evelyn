const { get } = require("superagent");
const { EmbedBuilder } = require("discord.js");
const { checkTarget } = require("./NekoHelper.js");

const embed = new EmbedBuilder()
  .setColor("Blurple")
  .setFooter({
    text: "This image was brought to you by the waifu.pics API.",
  })
  .setTimestamp();

module.exports = {
  bite: async (interaction, target) => {
    const { body } = await get("https://api.waifu.pics/sfw/bite");
    if (checkTarget(target, interaction)) return;

    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} bites ${target.username}`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  blush: async (interaction) => {
    const { body } = await get("https://api.waifu.pics/sfw/blush");
    if (checkTarget(target, interaction)) return;

    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} blushes`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  bonk: async (interaction, target) => {
    const { body } = await get("https://api.waifu.pics/sfw/bonk");
    if (checkTarget(target, interaction)) return;

    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} bonks ${target.username}`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  bully: async (interaction, target) => {
    const { body } = await get("https://api.waifu.pics/sfw/bully");
    if (checkTarget(target, interaction)) return;

    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} bullies ${target.username}`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  cringe: async (interaction) => {
    const { body } = await get("https://api.waifu.pics/sfw/cringe");
    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} thinks that's pretty cringe`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  cry: async (interaction) => {
    const { body } = await get("https://api.waifu.pics/sfw/cry");
    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} is crying`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  cuddle: async (interaction, target) => {
    const { body } = await get("https://api.waifu.pics/sfw/cuddle");
    if (checkTarget(target, interaction)) return;

    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} cuddles ${target.username}`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  handhold: async (interaction, target) => {
    const { body } = await get("https://api.waifu.pics/sfw/handhold");
    if (checkTarget(target, interaction)) return;

    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} is holding ${target.username}'s hand`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  highfive: async (interaction, target) => {
    const { body } = await get("https://api.waifu.pics/sfw/highfive");
    if (checkTarget(target, interaction)) return;

    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} highfives ${target.username}`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  hug: async (interaction, target) => {
    const { body } = await get("https://api.waifu.pics/sfw/hug");
    if (checkTarget(target, interaction)) return;

    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} hugs ${target.username}`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  kiss: async (interaction, target) => {
    const { body } = await get("https://api.waifu.pics/sfw/kiss");
    if (checkTarget(target, interaction)) return;

    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} kisses ${target.username}`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  pat: async (interaction, target) => {
    const { body } = await get("https://api.waifu.pics/sfw/pat");
    if (checkTarget(target, interaction)) return;

    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} pats ${target.username}`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  poke: async (interaction, target) => {
    const { body } = await get("https://api.waifu.pics/sfw/poke");
    if (checkTarget(target, interaction)) return;

    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} pokes ${target.username}`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  slap: async (interaction, target) => {
    const { body } = await get("https://api.waifu.pics/sfw/slap");
    if (checkTarget(target, interaction)) return;

    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} slaps ${target.username}`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
  wave: async (interaction, target) => {
    const { body } = await get("https://api.waifu.pics/sfw/wave");
    if (checkTarget(target, interaction)) return;

    return interaction.reply({
      embeds: [
        embed
          .setAuthor({
            name: `${interaction.user.username} waves at ${target.username}`,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setImage(body.url),
      ],
    });
  },
};
