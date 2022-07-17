const { CommandInteraction, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "bite",
  description: "Bite someone.",
  public: true,
  options: [
    {
      name: "target",
      description: "Provide a target.",
      type: 6,
      required: true,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const target = interaction.options.getMember("target");
    await target.user.fetch();
    const { body } = await superagent.get("https://api.waifu.pics/sfw/bite");

    if (target.id === interaction.user.id)
      return interaction.reply({ content: "No. <:peepo_stare:640305010135007255>" });

    const biteEmbed = new EmbedBuilder()
      .setColor("DARK_VIVID_PINK")
      .setAuthor({
        name: `${interaction.user.username} bites ${target.user.username}!`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setImage(body.url)
      .setTimestamp();

    interaction.reply({ embeds: [biteEmbed] });
  },
};
