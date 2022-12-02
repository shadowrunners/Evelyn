const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Provide a target.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Provide a reason.")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const { options } = interaction;
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
    const target = options.getMember("target");
    const reason = options.getString("reason") || "No reason specified.";

    const higherEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(
        "🔹 | You can't ban someone with a role higher than yours."
      )
      .setTimestamp();

    const evenHigherEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription("🔹 | I can't ban someone with a role higher than mine.")
      .setTimestamp();

    if (
      target.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({ embeds: [higherEmbed], ephemeral: true });
    if (
      target.roles.highest.position >=
      interaction.guild.members.me.roles.highest.position
    )
      return interaction.reply({ embeds: [evenHigherEmbed], ephemeral: true });

    target
      .send({
        embeds: [
          embed
            .setTitle(`${client.user.username} | Notice`)
            .setDescription(
              `You have been banned from ${interaction.guild.name} for ${reason}`
            ),
        ],
      })
      .catch();

    return interaction
      .reply({
        embeds: [
          embed.setDescription(
            `${target.user.tag} has been banned for ${reason}.`
          ),
        ],
      })
      .then(() => target.ban({ reason }));
  },
};
