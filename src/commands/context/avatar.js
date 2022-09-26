const {
  EmbedBuilder,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  UserContextMenuCommandInteraction,
} = require("discord.js");

module.exports = {
  botPermissions: ["SendMessages"],
  data: new ContextMenuCommandBuilder()
    .setName("User Avatar")
    .setType(ApplicationCommandType.User),
  /**
   * @param {UserContextMenuCommandInteraction} interaction
   */
  async execute(interaction) {
    const target = await interaction.guild.members.fetch(interaction.targetId);
    await target.user.fetch();

    const avatarEmbed = new EmbedBuilder()
      .setColor("Grey")
      .setTitle(`${target.user.tag}'s Avatar`)
      .setImage(target.user.avatarURL({ dynamic: true, size: 2048 }))
      .setURL(target.avatarURL());
    return interaction.reply({ embeds: [avatarEmbed], ephemeral: true });
  },
};
