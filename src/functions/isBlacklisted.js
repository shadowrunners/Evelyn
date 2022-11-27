const { EmbedBuilder } = require("discord.js");
const SB = require("../structures/schemas/serverBlacklist.js");
const UB = require("../structures/schemas/userBlacklist.js");

async function isBlacklisted(interaction) {
  const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

  const userBlacklist = await UB.findOne({
    userId: interaction.user.id,
  });

  const guildBlacklist = await SB.findOne({
    guildId: interaction.guild.id,
  });

  if (userBlacklist)
    return interaction.reply({
      embeds: [
        embed
          .setTitle("Blacklisted")
          .setDescription(
            `You have been blacklisted from using Evelyn, the reason behind this decision and the time this has occured is attached below. `
          )
          .addFields(
            {
              name: "Reason",
              value: `${userBlacklist.reason}`,
              inline: true,
            },
            {
              name: "Time",
              value: `<t:${parseInt(userBlacklist.time / 1000)}:R>`,
              inline: true,
            }
          ),
      ],
    });

  if (guildBlacklist)
    return interaction.reply({
      embeds: [
        embed
          .setTitle("Server Blacklisted")
          .setDescription(
            `This server has been blacklisted from using Evelyn, the reason behind this decision and the time this has occured is attached below. `
          )
          .addFields(
            {
              name: "Reason",
              value: `${guildBlacklist.reason}`,
              inline: true,
            },
            {
              name: "Time",
              value: `<t:${parseInt(guildBlacklist.time / 1000)}:R>`,
              inline: true,
            }
          ),
      ],
    });
}

module.exports = { isBlacklisted };
