<<<<<<< Updated upstream:src/commands/developer/blacklist.js
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const {
  addServerBlacklist,
  addUserBlacklist,
<<<<<<< Updated upstream:src/commands/developer/blacklist.js
} = require("../../engines/BlacklistEngine.js");
=======
} = require("../../modules/blacklistModule.js");
=======
const { SlashCommandBuilder } = require("discord.js");
>>>>>>> Stashed changes:src/commands/developer/blacklist/blacklist.js
>>>>>>> Stashed changes:src/commands/developer/blacklist/blacklist.js

module.exports = {
  botPermissions: ["SendMessages"],
  developer: true,
  data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Blacklist a user or server from using the bot.")
    .addSubcommand((options) =>
      options
        .setName("server")
        .setDescription("Blacklist a server.")
        .addStringOption((option) =>
          option
            .setName("serverid")
            .setDescription(
              "Provide the server ID of the server you would like to blacklist."
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Provide the reason of the blacklist.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("user")
        .setDescription("Blacklist a user.")
        .addStringOption((option) =>
          option
            .setName("userid")
            .setDescription(
              "Provide the ID of the user you would like to blacklist."
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Provide the reason of the blacklist.")
            .setRequired(true)
        )
    ),
<<<<<<< Updated upstream:src/commands/developer/blacklist.js
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    let serverID;
    let userID;
    let reason;

    switch (options.getSubcommand()) {
      case "server":
        serverID = options.getString("serverid");
        reason = options.getString("reason");

        return addServerBlacklist(interaction, serverID, reason);

      case "user":
        userID = options.getString("userid");
        reason = options.getString("reason");

        return addUserBlacklist(interaction, userID, reason);
    }
  },
=======
>>>>>>> Stashed changes:src/commands/developer/blacklist/blacklist.js
};
