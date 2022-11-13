const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { validateTrack } = require("../../../utils/playlistUtils.js");
const PDB = require("../../../structures/schemas/playlist.js");

module.exports = {
  subCommand: "playlist.removesong",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, user } = interaction;
    const pName = options.getString("name");
    const song = options.getNumber("songid");

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    const pData = await PDB.findOne({
      playlistName: pName,
      userID: user.id,
    });

    const tracks = pData?.playlistData;
    if (await validateTrack(interaction, song, tracks)) return;

    await PDB.updateOne(
      {
        userID: user.id,
        playlistName: pName,
      },
      {
        $pull: {
          playlistData: pData.playlistData[song],
        },
      }
    );

    return interaction.editReply({
      embeds: [
        embed.setDescription(
          `🔹 | **${tracks[song].title}** has been removed from your playlist.`
        ),
      ],
    });
  },
};
