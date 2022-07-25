const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const superagent = require("superagent");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blush")
    .setDescription(":flushed: but in glorious GIF form."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { body } = await superagent.get("https://api.waifu.pics/sfw/blush");

    const blushEmbed = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({
        name: `${interaction.user.username} blushes!`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setFooter({
        text: "This image was brought to you by the waifu.pics API.",
      })
      .setImage(body.url)
      .setTimestamp();
    interaction.reply({ embeds: [blushEmbed] });
  },
};
