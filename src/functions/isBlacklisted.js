const { EmbedBuilder } = require("discord.js");
const DB = require("../structures/schemas/guild.js");
const UB = require("../structures/schemas/userBlacklist.js");

async function isBlacklisted(interaction) {
  const { user, guildId } = interaction;
  const embed = new EmbedBuilder().setColor("Blurple");

  const userBlacklist = await UB.findOne({
    userId: user.id,
  });

  const guildData = await DB.findOne({
    id: guildId,
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

  if (guildData.blacklist.isBlacklisted === true)
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
              value: `${guildData.blacklist.reason}`,
              inline: true,
            },
            {
              name: "Time",
              value: `<t:${parseInt(guildData.blacklist.time / 1000)}:R>`,
              inline: true,
            }
          ),
      ],
    });
}

module.exports = { isBlacklisted };
