const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { validate } = require("../../../functions/playlistUtils.js");
const PDB = require("../../../structures/schemas/playlist.js");

module.exports = {
  subCommand: "playlist.addcurrent",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, user, guildId } = interaction;
    const player = client.manager.players.get(guildId);
    const pName = options.getString("name");

    await interaction.deferReply();

    if (!player) return;

    const track = player?.currentTrack;

    const pData = await PDB.findOne({
      playlistName: pName,
      userID: user.id,
    });

    if (validate(interaction, pData, track)) return;

    pData.playlistData.push({
      title: track.info.title,
      uri: track.info.uri,
      author: track.info.author,
      duration: track.info.length,
    });

    await PDB.updateOne(
      {
        userID: user.id,
        playlistName: pName,
      },
      {
        $push: {
          playlistData: {
            title: track.info.title,
            uri: track.info.uri,
            author: track.info.author,
            duration: track.info.length,
          },
        },
      }
    );

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `🔹 | **[${track.info.title}](${track.info.uri})** has been added to your playlist.`
          )
          .setTimestamp(),
      ],
    });
  },
};
