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
    if (player && !newState.guild.members.me.voice.channel) player.destroy();

    if (isUserLeavingVoiceChannel(oldState)) {
      if (AmIAlone(oldState)) {
        if (shouldILeave(oldState)) {
          savePerformance(player, oldState, newState);
        }
      }
    }
  },
};

function isUserLeavingVoiceChannel(state) {
  const { channelId } = state.guild.members.cache.get(client.user.id).voice;
  return channelId === state.channelId;
}

function AmIAlone(state) {
  const { channel } = state.guild.members.me.voice;
  if (!channel) return false;

  const nonBotMembers = channel.members.filter((m) => !m.user.bot);
  return nonBotMembers.size === 0;
}

function shouldILeave(state) {
  const members = state.guild.members.me.voice.channel?.members.size;
  return !members || members === 1;
}

function savePerformance(player, oldState, newState) {
  setTimeout(() => {
    const guild = client.guilds.cache.get(newState.guild.id);
    const textChannel = guild.channels.cache.get(player?.textId);

    const { channel } = oldState.guild.members.me.voice;
    if (channel) {
      player.destroy();
      textChannel?.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription("🔹 | I left your VC to save resources.")
            .setTimestamp(),
        ],
      });
    }
  }, 30000);
}
