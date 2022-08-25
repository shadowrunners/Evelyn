const { VoiceState, PermissionsBitField } = require("discord.js");
const { Speak } = PermissionsBitField.Flags;

module.exports = {
  name: "voiceStateUpdate",
  /**
   * @param {VoiceState} newState
   */
  async execute(newState) {
    if (
      newState.channelId &&
      newState.channel?.type === "GUILD_STAGE_VOICE" &&
      newState.guild.members.me?.voice.suppress
    ) {
      if (newState.guild.members.me.permissions.has(Speak)) {
        await newState.guild.members.me.voice.setSuppressed(false).catch(_err);
      }
    }
  },
};
