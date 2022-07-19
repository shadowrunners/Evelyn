const { CommandInteraction, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "slap",
  description: "Slap someone.",
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
    const { body } = await superagent.get("https://api.waifu.pics/sfw/slap");

    if (target.id === interaction.user.id)
    return interaction.reply({ content: "Why would you wanna slap yourself, honey?", ephemeral: true });

    const slapEmbed = new EmbedBuilder()
      .setColor("Grey")
      .setAuthor({
        name: `${interaction.user.username} slaps ${target.user.username}!`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setImage(body.url)
      .setTimestamp();
    interaction.reply({ embeds: [slapEmbed] });
  },
};
