const { EmbedBuilder } = require("discord.js");
const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

module.exports = {
  checkPlaylist: (pName, pData, userData) => {
    if (pName.length > 12)
      return interaction.editReply({
        embeds: [
          embed.setDescription(
            "🔹 | The name of the playlist cannot be more than 12 characters."
          ),
        ],
      });

    if (pData?.length > 0)
      return interaction.editReply({
        embeds: [
          embed.setDescription(
            `🔹 | This playlist already exists, delete it using: /playlist delete ${pName}.`
          ),
        ],
      });

    if (userData.length >= 10)
      return interaction.editReply({
        embeds: [
          embed.setDescription(
            "🔹 | You can only create 10 playlists at a time."
          ),
        ],
      });
  },
  validate: (interaction, pData, track) => {
    if (pData === null)
      return interaction.editReply({
        embeds: [
          embed.setDescription(
            "🔹 | There is no playlist with that name or no data regarding that user."
          ),
        ],
        ephemeral: true,
      });

    if (track === null)
      return interaction.editReply({
        embeds: [embed.setDescription("🔹 | Nothing is playing.")],
        ephemeral: true,
      });
  },
};
