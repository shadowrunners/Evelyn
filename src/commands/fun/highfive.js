const {
  Client,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const superagent = require("superagent");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("highfive")
    .setDescription("Highfive someone.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Provide a target.")
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const target = interaction.options.getMember("target");
    await target.user.fetch();

    const { body } = await superagent.get(
      "https://api.waifu.pics/sfw/highfive"
    );

    const lonerFive = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({
        name: `${interaction.user.username} highfives ${client.user.username}!`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setFooter({ text: "You're doing great, honey. <3" })
      .setImage(body.url)
      .setTimestamp();

    if (target.id === interaction.user.id)
      return interaction.reply({ embeds: [lonerFive] });

    const highfiveEmbed = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({
        name: `${interaction.user.username} highfives ${target.user.username}!`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setFooter({
        text: "This image was brought to you by the waifu.pics API.",
      })
      .setImage(body.url)
      .setTimestamp();
    interaction.reply({ embeds: [highfiveEmbed] });
  },
};
