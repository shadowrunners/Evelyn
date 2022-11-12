const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { checkVoice, checkForQueue } = require("../../../utils/musicUtils.js");
const { embedPages } = require("../../../utils/utils.js");

module.exports = {
  subCommand: "music.queue",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, guildId } = interaction;

    const player = client.manager.players.get(guildId);
    await interaction.deferReply();

    if (!player) return;
    if (await checkVoice(interaction)) return;
    if (checkForQueue(interaction, player)) return;

    const track = player.currentTrack;
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
    const getQueue =
      player.queue.length > 10 ? player.queue.slice(0, 10) : player.queue;
    const mappedQueue = getQueue.map(
      (t, i) =>
        `**${i + 1}.** [${t.info.title}](${t.info.uri}) [${t.info.requester}]`
    );

    const embeds = [];

    if (getQueue.length) {
      embed
        .setAuthor({ name: `Current queue for ${guild.name}` })
        .setTitle(`▶️ | Currently playing: ${track.info.title}`)
        .setDescription(mappedQueue.join("\n"));
      embeds.push(embed);
    }

    return await embedPages(client, interaction, embeds);
  },
};
