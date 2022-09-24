const { VoiceState, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { Speak } = PermissionsBitField.Flags;
const client = require("../../structures/index.js");

module.exports = {
  name: "voiceStateUpdate",
  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   */
  async execute(oldState, newState) {
    if (
      newState.channelId &&
      newState.channel?.type === "GUILD_STAGE_VOICE" &&
      newState.guild.members.me?.voice.suppress
    ) {
      if (newState.guild.members.me.permissions.has(Speak)) {
        await newState.guild.members.me.voice.setSuppressed(false).catch(_err);
      }
    }

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
          const player = client.manager?.players.get(newState.guild.id);
          const guild = client.guilds.cache.get(newState.guild.id);
          const textChannel = guild.channels.cache.get(player?.textChannel);

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
        }
      }
    }
  },
};
