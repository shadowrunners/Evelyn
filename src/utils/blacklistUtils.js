const serverBlacklist = require("../structures/schemas/serverBlacklist.js");
const userBlacklist = require("../structures/schemas/userBlacklist.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  isUserBlacklisted: async (interaction) => {
    const isUserBlacklisted = await userBlacklist.findOne({
      userID: interaction.user.id,
    });

    if (isUserBlacklisted) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Blacklisted")
            .setDescription(
              `🔹 | You have been blacklisted from using Evelyn, the reason behind this decision and the time this has occured is attached below. `
            )
            .addFields(
              {
                name: "Reason",
                value: `${isUserBlacklisted.reason}`,
                inline: true,
              },
              {
                name: "Time",
                value: `<t:${parseInt(isUserBlacklisted.time / 1000)}:R>`,
                inline: true,
              }
            ),
        ],
      });
    }
  },
  isServerBlacklisted: async (interaction) => {
    const isGuildBlacklisted = await serverBlacklist.findOne({
      userID: interaction.guild.id,
    });

    if (isGuildBlacklisted) {
      return interaction.reply({
        embeds: [
          embed
            .setTitle("Server Blacklisted")
            .setDescription(
              `🔹 | This server has been blacklisted from using Evelyn, the reason behind this decision and the time this has occured is attached below. `
            )
            .addFields(
              {
                name: "Reason",
                value: `${isGuildBlacklisted.reason}`,
                inline: true,
              },
              {
                name: "Time",
                value: `<t:${parseInt(isGuildBlacklisted.time / 1000)}:R>`,
                inline: true,
              }
            ),
        ],
      });
    }
  },
};
