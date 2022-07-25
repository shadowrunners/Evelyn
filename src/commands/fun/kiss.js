const {
  Client,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const superagent = require("superagent");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("Kiss someone.")
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

    const { body } = await superagent.get("https://api.waifu.pics/sfw/kiss");

    if (target.id === interaction.user.id) {
      const lonerKiss = new EmbedBuilder()
        .setColor("Grey")
        .setAuthor({
          name: `${client.user.username} kisses ${target.user.username}!`,
          iconURL: `${client.user.avatarURL({ dynamic: true })}`,
        })
        .setFooter({
          text: "This image was brought to you by the waifu.pics API.",
        })
        .setImage(body.url)
        .setTimestamp();
      return interaction.reply({ embeds: [lonerKiss] });
    }

    const kissEmbed = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({
        name: `${interaction.user.username} kisses ${target.user.username}!`,
        iconURL: `${target.user.avatarURL({ dynamic: true })}`,
      })
      .setFooter({
        text: "This image was brought to you by the waifu.pics API.",
      })
      .setImage(body.url)
      .setTimestamp();
    return interaction.reply({ embeds: [kissEmbed] });
  },
};
