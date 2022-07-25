const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const superagent = require("superagent");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bite")
    .setDescription("Bite someone.")
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

    const { body } = await superagent.get("https://api.waifu.pics/sfw/bite");

    if (target.id === interaction.user.id)
      return interaction.reply({
        content: "No. <:peepo_stare:640305010135007255>",
      });

    const biteEmbed = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({
        name: `${interaction.user.username} bites ${target.user.username}!`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setFooter({
        text: "This image was brought to you by the waifu.pics API.",
      })
      .setImage(body.url)
      .setTimestamp();

    interaction.reply({ embeds: [biteEmbed] });
  },
};
