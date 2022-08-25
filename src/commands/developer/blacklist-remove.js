const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const guildBLK = require("../../structures/schemas/serverBlacklist.js");
const userBLK = require("../../structures/schemas/userBlacklist.js");

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
   * @param {Client} client
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const { options } = interaction;

    switch (options.getSubcommand()) {
      case "server": {
        const gID = options.getString("serverid");
        const data = await guildBLK.findOne({ serverID: gID });

        if (data) {
          await guildBLK.deleteOne({ serverID: gID });
          embed
            .setColor("Blurple")
            .setTitle(`${client.user.username} | Blacklist`)
            .setDescription(
              `🔹 | This guild has been removed from the blacklist.`
            )
            .setTimestamp();
          return interaction.reply({ embeds: [embed] });
        }

        if (!data) {
          embed
            .setColor("Blurple")
            .setTitle(`${client.user.username} | Blacklist`)
            .setDescription(`🔹 | This guild is not blacklisted.`)
            .setTimestamp();
          return interaction.reply({ embeds: [embed] });
        }
      }
      case "user": {
        const uID = options.getString("userid");
        const data = await userBLK.findOne({ serverID: uID });

        if (data) {
          await userBLK.deleteOne({ userid: uID });
          embed
            .setColor("Blurple")
            .setTitle(`${client.user.username} | Blacklist`)
            .setDescription(
              `🔹 | This user has been removed from the blacklist.`
            )
            .setTimestamp();
          return interaction.reply({ embeds: [embed] });
        }

        if (!data) {
          embed
            .setColor("Blurple")
            .setTitle(`${client.user.username} | Blacklist`)
            .setDescription(`🔹 | This user is not blacklisted.`)
            .setTimestamp();
          return interaction.reply({ embeds: [embed] });
        }
      }
    }
  },
};
