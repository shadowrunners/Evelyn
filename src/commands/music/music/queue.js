const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const {
  checkVoice,
  checkForQueue,
} = require("../../../functions/musicUtils.js");
const { embedPages } = require("../../../functions/utils.js");

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

    const songs = [];
    const embeds = [];

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    for (let i = 0; i < player.queue.length; i++) {
      songs.push(
        `${i + 1}. [${player.queue[i].title}](${player.queue[i].uri}) [${
          player.queue[i].requester
        }]`
      );
    }

    for (let i = 0; i < songs.length; i += 10) {
      embed
        .setAuthor({ name: `Current queue for ${guild.name}` })
        .setTitle(`▶️ | Currently playing: ${player.queue.current.title}`)
        .setDescription(songs.slice(i, i + 10).join("\n"));
      embeds.push(embed);
    }

    return await embedPages(client, interaction, embeds);
  },
};
