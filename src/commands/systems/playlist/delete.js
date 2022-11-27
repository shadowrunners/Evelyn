const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { validate } = require("../../../functions/playlistUtils.js");
const PDB = require("../../../structures/schemas/playlist.js");

module.exports = {
  subCommand: "playlist.delete",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, user } = interaction;
    const pName = options.getString("name");

    const pData = await PDB.findOne({
      userID: user.id,
      playlistName: pName,
    });

    if (validate(interaction, pData)) return;

    await pData.delete();

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`🔹 | Your playlist **${pName}** has been deleted.`)
          .setTimestamp(),
      ],
    });
  },
};
