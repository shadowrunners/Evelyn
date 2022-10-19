const {
  Client,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const { catto } = require("../../modules/cattoModule.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("See a random cat picture!"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    catto(interaction, client);
  },
};
