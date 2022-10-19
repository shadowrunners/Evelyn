const { get } = require("superagent");
const { EmbedBuilder } = require("discord.js");

const embed = new EmbedBuilder()
  .setColor("Blurple")
  .setFooter({
    text: "This image was brought to you by the waifu.pics API.",
  })
  .setTimestamp();

module.exports = {
  bite: async (interaction, target) => {
    const { body } = await get("https://api.waifu.pics/sfw/bite");
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
    const { body } = await get("https://api.waifu.pics/sfw/cringe");
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
