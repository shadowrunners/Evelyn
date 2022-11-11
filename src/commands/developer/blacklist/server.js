const { ChatInputCommandInteraction } = require("discord.js");
const { addServerBlacklist } = require("../../../engines/BlacklistEngine.js");

module.exports = {
  subCommand: "blacklist.server",
  /**
   * @param {ChatInputCommandInteraction} interaction,
   */
  async execute(interaction) {
    const { options } = interaction;

    const serverID = options.getString("serverid");
    const reason = options.getString("reason");

    return addServerBlacklist(interaction, serverID, reason);
  },
};
