const { ChatInputCommandInteraction } = require("discord.js");
const { addUserBlacklist } = require("../../../engines/BlacklistEngine.js");

module.exports = {
  subCommand: "blacklist.user",
  /**
   * @param {ChatInputCommandInteraction} interaction,
   */
  async execute(interaction) {
    const { options } = interaction;

    const userID = options.getString("userid");
    const reason = options.getString("reason");

    return addUserBlacklist(interaction, userID, reason);
  },
};
