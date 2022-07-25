const {
  Client,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const superagent = require("superagent");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pat")
    .setDescription("Pat someone.")
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
    const { body } = await superagent.get("https://api.waifu.pics/sfw/pat");

    const lonerPat = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({
        name: `${client.user.username} pats ${interaction.user.username}!`,
        iconURL: `${client.user.avatarURL({ dynamic: true })}`,
      })
      .setFooter({
        text: "This image was brought to you by the waifu.pics API.",
      })
      .setImage(body.url)
      .setTimestamp();

    if (target.id === interaction.user.id)
      return interaction.reply({ embeds: [lonerPat] });

    const patEmbed = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({
        name: `${interaction.user.username} pats ${target.user.username}!`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setFooter({
        text: "This image was brought to you by the waifu.pics API.",
      })
      .setImage(body.url)
      .setTimestamp();
    interaction.reply({ embeds: [patEmbed] });
  },
};
