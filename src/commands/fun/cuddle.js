const { Client, CommandInteraction, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "cuddle",
  description: "Cuddle someone.",
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
   * @param {Client} client
   */
  async execute(interaction, client) {
    const target = interaction.options.getMember("target");
    await target.user.fetch();
    const { body } = await superagent.get("https://api.waifu.pics/sfw/cuddle");

    const lonerCuddle = new EmbedBuilder()
      .setAuthor({
        name: `${client.user.username} cuddles ${interaction.user.username}!`,
        iconURL: `${client.user.avatarURL({ dynamic: true })}`,
      })
      .setImage(body.url)
      .setTimestamp();

    if (target.id === interaction.user.id)
      return interaction.reply({ embeds: [lonerCuddle] });

    const cuddleEmbed = new EmbedBuilder()
      .setColor("BLURPLE")
      .setAuthor({
        name: `${interaction.user.username} cuddles ${target.user.username}!`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setImage(body.url)
      .setTimestamp();
    interaction.reply({ embeds: [cuddleEmbed] });
  },
};
