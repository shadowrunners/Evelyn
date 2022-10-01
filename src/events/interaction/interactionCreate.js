const {
  Client,
  CommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const guildBLK = require("../../structures/schemas/serverBlacklist.js");
const userBLK = require("../../structures/schemas/userBlacklist.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (
      interaction.isChatInputCommand() ||
      interaction.isUserContextMenuCommand()
    ) {
      const Embed = new EmbedBuilder();

      const command = client.commands.get(interaction.commandName);
      Embed.setColor("Grey").setDescription("This command is outdated.");

      const isUserBlacklisted = await userBLK.findOne({
        userid: interaction.user.id,
      });

      const isGuildBlacklisted = await guildBLK.findOne({
        guildid: interaction.guild.id,
      });

      if (isUserBlacklisted) {
        Embed.setColor("Blurple")
          .setTitle("Blacklisted")
          .setDescription(
            `🔹 | You have been blacklisted from using ${client.user.username}, the reason behind this decision and the time this has occured is attached below.`
          )
          .addFields(
            { name: "Reason", value: `${isUserBlacklisted.reason}` },
            {
              name: "Time",
              value: `<t:${parseInt(isUserBlacklisted.time / 1000)}:R>`,
            }
          );
        return interaction.reply({ embeds: [Embed] });
      }

      if (isGuildBlacklisted) {
        Embed.setColor("Blurple")
          .setTitle("Server Blacklisted")
          .setDescription(
            `🔹 | This server has been blacklisted from using ${client.user.username}, the reason behind this decision and the time this has occured is attached below.`
          )
          .addFields(
            { name: "Reason", value: `${isGuildBlacklisted.reason}` },
            {
              name: "Time",
              value: `<t:${parseInt(isGuildBlacklisted.time / 1000)}:R>`,
            }
          );
        return interaction.reply({ embeds: [Embed] });
      }

      if (!command) {
        return interaction.reply({ embeds: [Embed] });
      }

      if (
        interaction.guild.members.me.permissions.has(
          PermissionsBitField.resolve("Administrator")
        )
      )
        command.execute(interaction, client);

      if (command.botPermissions) {
        if (
          !interaction.guild.members.me.permissions.has(
            PermissionsBitField.resolve(command.botPermissions || [])
          )
        )
          return interaction.reply({
            embeds: [
              Embed.setColor("Blurple")
                .setTitle("Missing Permissions")
                .setDescription(
                  `🔹 | I'm missing several permissions, might wanna have a look at that.`
                )
                .addFields({
                  name: "Permissions Missing",
                  value: `${command.botPermissions}`,
                }),
            ],
            ephemeral: true,
          });
      }
    }
  },
};
