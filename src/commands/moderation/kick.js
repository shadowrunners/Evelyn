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
  execute(interaction, client) {
    const { options } = interaction;
    const target = options.getMember("target");
    const reason = options.getString("reason") || "No reason specified.";
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    if (
      target.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        embeds: [
          embed.setDescription(
            "🔹 | You can't kick someone with a role higher than yours."
          ),
        ],
        ephemeral: true,
      });

    if (
      target.roles.highest.position >=
      interaction.guild.members.me.roles.highest.position
    )
      return interaction.reply({
        embeds: [
          embed.setDescription(
            "🔹 | I can't kick someone with a role higher than mine."
          ),
        ],
        ephemeral: true,
      });

    target
      .send({
        embeds: [
          embed
            .setTitle(`${client.user.username} | Notice`)
            .setDescription(
              `You have been kicked from ${interaction.guild.name} for ${reason}`
            ),
        ],
      })
      .catch();

    return interaction
      .reply({
        embeds: [
          embed.setDescription(
            `${target.user.tag} has been kicked for ${reason}.`
          ),
        ],
      })
      .then(() => target.kick({ reason }));
  },
};
