const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { ManageGuild } = PermissionsBitField.Flags;

module.exports = {
  botPermissions: ["SendMessages", "ManageGuild"],
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Create a giveaway or manage a giveaway.")
    .setDefaultMemberPermissions(ManageGuild)
    .addSubcommand((options) =>
      options.setName("create").setDescription("Create a giveaway.")
    )
    .addSubcommand((options) =>
      options
        .setName("manage")
        .setDescription("Manage a giveaway.")
        .addStringOption((option) =>
          option
            .setName("toggle")
            .setDescription("Select an option.")
            .setRequired(true)
            .addChoices(
              { name: "🔹 | End", value: "end" },
              { name: "🔹 | Pause", value: "pause" },
              { name: "🔹 | Unpause", value: "unpause" },
              { name: "🔹 | Reroll", value: "reroll" },
              { name: "🔹 | Delete", value: "delete" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("messageid")
            .setDescription("Provide the message of the giveaway ID.")
            .setRequired(true)
        )
    ),
};
