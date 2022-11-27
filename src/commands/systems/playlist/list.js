const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { validate } = require("../../../functions/playlistUtils.js");
const PDB = require("../../../structures/schemas/playlist.js");
const Util = require("../../../functions/utils.js");

module.exports = {
  subCommand: "playlist.list",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { user } = interaction;
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    await interaction.deferReply();

    const pData = await PDB.find({
      userID: user.id,
    });

    if (validate(interaction, pData)) return;

    const playlists = [];
    const embeds = [];

    for (let i = 0; i < pData.length; i++) {
      playlists.push(
        `**${pData[i].playlistName}** • ${pData[i].playlistData?.length} song(s)`
      );
    }

    for (let i = 0; i < playlists.length; i += 10) {
      embed
        .setTitle(`Playlists curated by ${pData[i].name}`)
        .setDescription(playlists.slice(i, i + 10).join("\n"));
      embeds.push(embed);
    }

    return await Util.embedPages(client, interaction, embeds);
  },
};
