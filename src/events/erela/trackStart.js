const client = require("../../structures/index.js");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { Primary } = ButtonStyle;
const { Player, Track } = require("erela.js");
const pms = require("pretty-ms");

module.exports = {
  name: "trackStart",
  /**
   * @param {Player} player
   * @param {Track} track
   */
  async execute(player, track) {
    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("pause").setLabel("⏯️").setStyle(Primary),
      new ButtonBuilder().setCustomId("skip").setLabel("⏭️").setStyle(Primary),
      new ButtonBuilder().setCustomId("volup").setLabel("🔊").setStyle(Primary),
      new ButtonBuilder()
        .setCustomId("voldown")
        .setLabel("🔉")
        .setStyle(Primary),
      new ButtonBuilder()
        .setCustomId("shuffle")
        .setLabel("🔀")
        .setStyle(Primary)
    );

    const nowPlaying = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🎧 Started Playing")
      .setDescription(`**[${track.title}](${track.uri})**`)
      .addFields(
        {
          name: "Queued by",
          value: `<@${track.requester.id}>`,
          inline: true,
        },
        { name: "Duration", value: pms(track.duration), inline: true }
      )
      .setThumbnail(track.thumbnail)
      .setTimestamp();

    let message = await client.channels.cache
      .get(player.textChannel)
      .send({ embeds: [nowPlaying], components: [buttonRow] });

    setTimeout(() => message.delete(), track.duration);
  },
};
