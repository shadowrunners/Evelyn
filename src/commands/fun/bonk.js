const { CommandInteraction, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "bonk",
  description: "Bonk someone.",
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
    const { body } = await superagent.get("https://api.waifu.pics/sfw/bonk");

    const bonkieEmbed = new EmbedBuilder()
      .setColor("DARK_VIVID_PINK")
      .setAuthor({
        name: `${interaction.user.username} bonks... themselves?`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setImage(body.url)
      .setTimestamp();

    if (target.id === interaction.user.id)
      return interaction.reply({ embeds: [bonkieEmbed] });

    const bonkietwo = new MessageEmbed()
      .setColor("DARK_VIVID_PINK")
      .setAuthor({
        name: `${interaction.user.username} bonks ${target.user.username}!`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setImage(body.url)
      .setTimestamp();
    interaction.reply({ embeds: [bonkietwo] });
  },
};
