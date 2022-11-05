const serverBlacklist = require("../structures/schemas/serverBlacklist.js");
const userBlacklist = require("../structures/schemas/userBlacklist.js");
const { EmbedBuilder } = require("discord.js");
const embed = new EmbedBuilder()
  .setColor("Blurple")
  .setTitle("Evelyn | Blacklist")
  .setTimestamp();

module.exports = {
  addServerBlacklist: async (interaction, guildId, blacklist_reason) => {
    const data = await serverBlacklist.findOne({ serverID: guildId });
    if (!data) {
      const newBlacklist = new serverBlacklist({
        serverID: guildId,
        reason: blacklist_reason,
        time: Date.now(),
      });

      await newBlacklist.save();

      return interaction.reply({
        embeds: [
          embed
            .setDescription("This guild has been successfully blacklisted.")
            .addFields({ name: "🔹 | Reason", value: blacklist_reason }),
        ],
      });
    } else {
      return interaction.reply({
        embeds: [embed.setDescription("This guild is already blacklisted.")],
      });
    }
  },

  addUserBlacklist: async (interaction, userId, blacklist_reason) => {
    const data = await userBlacklist.findOne({ userID: userId });
    if (!data) {
      const newBlacklist = new userBlacklist({
        userID: userId,
        reason: blacklist_reason,
        time: Date.now(),
      });

      await newBlacklist.save();

      return interaction.reply({
        embeds: [
          embed
            .setDescription("This user has been successfully blacklisted.")
            .addFields({ name: "🔹 | Reason", value: blacklist_reason }),
        ],
      });
    } else {
      return interaction.reply({
        embeds: [
          embed.setDescription("🔹 | This user is already blacklisted."),
        ],
      });
    }
  },

  removeServerBlacklist: async (interaction, guildId) => {
    const data = await serverBlacklist.findOne({ serverID: guildId });
    if (data) {
      await data.deleteOne({ serverID: guildId });
      return interaction.reply({
        embeds: [
          embed.setDescription(
            "🔹 | This guild has been removed from the blacklist."
          ),
        ],
      });
    } else {
      return interaction.reply({
        embeds: [embed.setDescription("🔹 | This guild isn't blacklisted.")],
      });
    }
  },

  removeUserBlacklist: async (interaction, userId) => {
    const data = await userBlacklist.findOne({ userID: userId });
    if (data) {
      await data.deleteOne({ userID: userId });
      return interaction.reply({
        embeds: [
          embed.setDescription(
            "🔹 | This user has been removed from the blacklist."
          ),
        ],
      });
    } else {
      return interaction.reply({
        embeds: [embed.setDescription("This user isn't blacklisted.")],
      });
    }
  },
};
