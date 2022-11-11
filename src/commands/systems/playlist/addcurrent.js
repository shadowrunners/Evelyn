const { ChatInputCommandInteraction, Client } = require("discord.js");
const { addCurrent } = require("../../../engines/PLEngine.js");

module.exports = {
  subCommand: "playlist.addcurrent",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guildId } = interaction;

    const player = client.manager.players.get(guildId);
    const pName = options.getString("name");

    if (!player) return;

    return addCurrent(interaction, player, pName);
  },
};
