const { get } = require("superagent");
const { EmbedBuilder } = require("discord.js");

async function waifuImages(action, target, interaction) {
  const { body } = await get(`https://api.waifu.pics/sfw/${action}`);
  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setFooter({
      text: "This image was brought to you by the waifu.pics API.",
    })
    .setImage(body.url)
    .setTimestamp();

  if (target.id === interaction.user.id)
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setDescription("🔹 | You can't use this command on yourself.")
          .setTimestamp(),
      ],
      ephemeral: true,
    });

  switch (action) {
    case "bite":
      embed.setAuthor({
        name: `${interaction.user.username} bites ${target.username}`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

      return interaction.reply({ embeds: [embed] });

    case "blush":
      embed.setAuthor({
        name: `${interaction.user.username} blushes`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });
      return interaction.reply({ embeds: [embed] });

    case "bonk":
      embed.setAuthor({
        name: `${interaction.user.username} bonks ${target.username}`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });
      return interaction.reply({ embeds: [embed] });

    case "bully":
      embed.setAuthor({
        name: `${interaction.user.username} blushes ${target.username}`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

      return interaction.reply({ embeds: [embed] });

    case "cringe":
      embed.setAuthor({
        name: `${interaction.user.username} thinks that's pretty cringe`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

      return interaction.reply({ embeds: [embed] });

    case "cry":
      embed.setAuthor({
        name: `${interaction.user.username} is crying`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });
      return interaction.reply({ embeds: [embed] });

    case "cuddle":
      embed.setAuthor({
        name: `${interaction.user.username} cuddles ${target.username}`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

      return interaction.reply({ embeds: [embed] });

    case "handhold":
      embed.setAuthor({
        name: `${interaction.user.username} is holding ${target.username}'s hand`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

      return interaction.reply({ embeds: [embed] });

    case "highfive":
      embed.setAuthor({
        name: `${interaction.user.username} highfives ${target.username}`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

      return interaction.reply({ embeds: [embed] });

    case "hug":
      embed.setAuthor({
        name: `${interaction.user.username} hugs ${target.username}`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

      return interaction.reply({ embeds: [embed] });

    case "kiss":
      embed.setAuthor({
        name: `${interaction.user.username} kisses ${target.username}!`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

      return interaction.reply({ embeds: [embed] });
    case "pat":
      embed.setAuthor({
        name: `${interaction.user.username} pats ${target.username}`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

      return interaction.reply({ embeds: [embed] });
    case "poke":
      embed.setAuthor({
        name: `${interaction.user.username} pokes ${target.username}`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

      return interaction.reply({ embeds: [embed] });
    case "slap":
      embed.setAuthor({
        name: `${interaction.user.username} slaps ${target.username}`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

      return interaction.reply({ embeds: [embed] });
    case "wave":
      embed.setAuthor({
        name: `${interaction.user.username} waves at ${target.username}`,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

      return interaction.reply({ embeds: [embed] });
  }
}

module.exports = { waifuImages };
