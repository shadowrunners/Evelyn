const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Announce something.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((option) =>
      option.setName("message").setDescription("Message.").setRequired(true)
    )
    .addChannelOption((option) =>
      option.setName("channel").setDescription("Channel.").setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Mention a role alongside the announcement.")
        .setRequired(false)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;

    const message = options.getString("message");
    const channel = options.getChannel("channel");
    const role = options.getRole("role");

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(message)
      .setTimestamp();

    interaction.reply({
      embeds: [
        embed
          .setColor("Blurple")
          .setDescription("🔹 | Announcement sent.")
          .setRequired(true),
      ],
    });

    if (role)
      return channel.send({ content: `<@${role.id}>`, embeds: [embed] });
    else {
      return channel.send({ embeds: [embed] });
    }
  },
};
