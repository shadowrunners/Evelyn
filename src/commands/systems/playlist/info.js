const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const PDB = require("../../../structures/schemas/playlist.js");
const { validate } = require("../../../functions/playlistUtils.js");
const Util = require("../../../functions/utils.js");
const pms = require("pretty-ms");

module.exports = {
  subCommand: "playlist.info",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, user } = interaction;
    const pName = options.getString("name");
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    await interaction.deferReply();

    const pData = await PDB.findOne({
      playlistName: pName,
      userID: user.id,
    });

    if (validate(interaction, pData)) return;

    let i = 0;
    const trackData = pData.playlistData;
    const list = pData.playlistData.length;
    const tracks = [];
    const embeds = [];

    for (i; i < list; i++) {
      tracks.push(
        `${i + 1} • **[${trackData[i].title}](${trackData[i].uri})** • [${pms(
          trackData[i].duration
        )}]`
      );
    }

    for (i = 0; i < tracks.length; i += 10) {
      embed
        .setTitle(`${pData.playlistName} by ${pData.name}`)
        .setDescription(tracks.slice(i, i + 10).join("\n"));
      embeds.push(embed);
    }

    await Util.embedPages(client, interaction, embeds);
  },
};
