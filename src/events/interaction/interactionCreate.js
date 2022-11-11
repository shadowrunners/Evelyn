const {
  Client,
  CommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const serverBlacklist = require("../../structures/schemas/serverBlacklist.js");
const userBlacklist = require("../../structures/schemas/userBlacklist.js");

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
      const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
      const command = client.commands.get(interaction.commandName);

      const isUserBlacklisted = await userBlacklist.findOne({
        userID: interaction.user.id,
      });

      const isGuildBlacklisted = await serverBlacklist.findOne({
        serverID: interaction.guild.id,
      });

      if (isUserBlacklisted) {
        return interaction.reply({
          embeds: [
            embed
              .setTitle("Blacklisted")
              .setDescription(
                `🔹 | You have been blacklisted from using Evelyn, the reason behind this decision and the time this has occured is attached below. `
              )
              .addFields(
                {
                  name: "Reason",
                  value: `${isUserBlacklisted.reason}`,
                  inline: true,
                },
                {
                  name: "Time",
                  value: `<t:${parseInt(isUserBlacklisted.time / 1000)}:R>`,
                  inline: true,
                }
              ),
          ],
        });
      }

      if (isGuildBlacklisted) {
        return interaction.reply({
          embeds: [
            embed
              .setTitle("Server Blacklisted")
              .setDescription(
                `🔹 | This server has been blacklisted from using Evelyn, the reason behind this decision and the time this has occured is attached below. `
              )
              .addFields(
                {
                  name: "Reason",
                  value: `${isGuildBlacklisted.reason}`,
                  inline: true,
                },
                {
                  name: "Time",
                  value: `<t:${parseInt(isGuildBlacklisted.time / 1000)}:R>`,
                  inline: true,
                }
              ),
          ],
        });
      }

      if (!command) {
        return interaction.reply({
          embeds: [embed.setDescription("This command is outdated.")],
        });
      }

      const subCommand = interaction.options.getSubcommand(false);
      if (subCommand) {
        const subCommandFile = client.subCommands.get(
          `${interaction.commandName}.${subCommand}`
        );
        if (!subCommandFile)
          return interaction.reply({
            embeds: [embed.setDescription("This subcommand is outdated.")],
            ephemeral: true,
          });
        subCommandFile.execute(interaction, client);
      }

      if (command.botPermissions) {
        if (
          !interaction.guild.members.me.permissions.has(
            PermissionsBitField.resolve(command.botPermissions || [])
          )
        )
          return interaction.reply({
            embeds: [
              embed
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
