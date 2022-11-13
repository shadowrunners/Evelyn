const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { checkPlaylist } = require("../../../utils/playlistUtils.js");
const PDB = require("../../../structures/schemas/playlist.js");

module.exports = {
  subCommand: "playlist.create",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, user } = interaction;
    const pName = options.getString("name");

    await interaction.deferReply();

    const pData = await PDB.findOne({
      userID: user.id,
      playlistName: pName,
    });

    const userData = await PDB.findOne({
      userID: user.id,
    });

    if (checkPlaylist(pName, pData, userData)) return;

    const newPlaylist = new PDB({
      name: user.username,
      userID: user.id,
      playlistName: pName,
      created: Math.round(Date.now() / 1000),
    });

    await newPlaylist.save();

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`🔹 | Your playlist **${pName}** has been created.`)
          .setTimestamp(),
      ],
    });
  },
};
