const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
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
  async execute(interaction, client) {
    const { options } = interaction;
    const target = options.getMember("target");
    const reason = options.getString("reason") || "No reason specified.";

    const higherEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(
        "🔹 | You can't kick someone with a role higher than yours."
      )
      .setTimestamp();

    const evenHigherEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription("🔹 | I can't kick someone with a role higher than mine.")
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

    const kickedNotif = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(`${client.user.username} | Notice`)
      .setDescription(
        `You have been kicked from ${interaction.guild.name} for ${reason}`
      )
      .setTimestamp();

    const successEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(`${target.user.tag} has been kicked for ${reason}.`)
      .setTimestamp();

    target.send({ embeds: [kickedNotif] }).catch(_err);

    return interaction.reply({ embeds: [successEmbed] }).then(() => {
      target.kick({ reason });
    });
  },
};
