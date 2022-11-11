const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const {
  removeServerBlacklist,
  removeUserBlacklist,
} = require("../../engines/BlacklistEngine.js");

module.exports = {
  botPermissions: ["SendMessages"],
  developer: true,
  data: new SlashCommandBuilder()
    .setName("blacklist-remove")
    .setDescription("Remove a user or server from the blacklist.")
    .addSubcommand((options) =>
      options
        .setName("server")
        .setDescription("Remove a server from the blacklist.")
        .addStringOption((option) =>
          option
            .setName("serverid")
            .setDescription(
              "Provide the server ID of the server you would like to remove from the blacklist."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("user")
        .setDescription("Remove a user from the blacklist.")
        .addStringOption((option) =>
          option
            .setName("userid")
            .setDescription(
              "Provide the ID of the user you would like to blacklist."
            )
            .setRequired(true)
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    let guildID;
    let userID;

    switch (options.getSubcommand()) {
      case "server":
        guildID = options.getString("serverid");
        return removeServerBlacklist(interaction, guildID);

      case "user":
        userID = options.getString("userid");
        return removeUserBlacklist(interaction, userID);
    }
  },
};
