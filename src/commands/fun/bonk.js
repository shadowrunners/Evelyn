const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const superagent = require("superagent");

module.exports = {
  data: new SlashCommandBuilder()
    .setTitle("bonk")
    .setDescription("Bonk someone.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Provide a target.")
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const target = interaction.options.getMember("target");
    await target.user.fetch();

    const { body } = await superagent.get("https://api.waifu.pics/sfw/bonk");

    const bonkieEmbed = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({
        name: `${interaction.user.username} bonks... themselves?`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setFooter({
        text: "This image was brought to you by the waifu.pics API.",
      })
      .setImage(body.url)
      .setTimestamp();

    if (target.id === interaction.user.id)
      return interaction.reply({ embeds: [bonkieEmbed] });

    const bonkietwo = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({
        name: `${interaction.user.username} bonks ${target.user.username}!`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setFooter({
        text: "This image was brought to you by the waifu.pics API.",
      })
      .setImage(body.url)
      .setTimestamp();
    interaction.reply({ embeds: [bonkietwo] });
  },
};
