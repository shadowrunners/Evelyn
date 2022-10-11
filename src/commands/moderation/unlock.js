const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const DB = require("../../structures/schemas/lockdown.js");
const { ManageChannels, SendMessages } = PermissionsBitField.Flags;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock a channel.")
    .setDefaultMemberPermissions(ManageChannels),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, channel } = interaction;
    const Embed = new EmbedBuilder();

    if (channel.permissionsFor(guild.id).has(SendMessages))
      return interaction.reply({
        embeds: [
          Embed.setColor("Blurple")
            .setDescription("🔹 | This channel is not locked.")
            .setTimestamp(),
        ],
      });
    channel.permissionOverwrites.edit(guild.id, {
      SendMessages: null,
    });

    await DB.deleteOne({ ChannelID: channel.id });
    interaction.reply({
      embeds: [
        Embed.setColor("Blurple")
          .setDescription("🔹 | Lockdown has been lifted.")
          .setTimestamp(),
      ],
    });
  },
};
