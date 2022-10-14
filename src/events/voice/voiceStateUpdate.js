const { VoiceState, EmbedBuilder } = require("discord.js");
const client = require("../../structures/index.js");

module.exports = {
  name: "voiceStateUpdate",
  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   */
  execute(oldState, newState) {
    const player = client.manager.players.get(oldState.guild.id);

    if (!newState.guild.members.me.voice.channel) player?.destroy();

    if (
      oldState.guild.members.cache.get(client.user.id).voice.channelId ===
      oldState.channelId
    ) {
      if (
        oldState.guild.members.me.voice?.channel &&
        oldState.guild.members.me.voice.channel.members.filter(
          (m) => !m.user.bot
        ).size === 0
      ) {
        const members = oldState.guild.members.me.voice.channel?.members.size;
        if (!members || members === 1) {
          const guild = client.guilds.cache.get(newState.guild.id);
          const textChannel = guild.channels.cache.get(player?.textId);

          setTimeout(() => {
            player
              ? player.destroy()
              : oldState.guild.members.me.voice.channel.leave();

            textChannel?.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("Blurple")
                  .setDescription(
                    "🔹 | I left your VC because you left me to play music by myself."
                  )
                  .setTimestamp(),
              ],
            });
          }, 30000);
        }
      }
    }
  },
};
