const {
  EmbedBuilder,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  UserContextMenuCommandInteraction,
} = require("discord.js");

module.exports = {
  botPermissions: ["SendMessages", "EmbedLinks"],
  data: new ContextMenuCommandBuilder()
    .setName("User Banner")
    .setType(ApplicationCommandType.User),
  /**
   * @param {UserContextMenuCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, targetId } = interaction;
    const target = await guild.members.fetch(targetId);
    const { user } = target;

    await user.fetch();

    if (!user.banner)
      return interaction.reply({
        content: "🔹 | This user doesn't have a banner.",
        ephemeral: true,
      });

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setTitle(`${user.username}'s Banner`)
          .setURL(user.bannerURL({ size: 4096, format: "png", size: 4096 }))
          .setImage(
            user.bannerURL({ dynamic: true, format: "png", size: 4096 })
          ),
      ],
      ephemeral: true,
    });
  },
};
