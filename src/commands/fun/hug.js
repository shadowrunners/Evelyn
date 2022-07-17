const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "hug",
  description: "Hug someone.",
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
    const { body } = await superagent.get("https://api.waifu.pics/sfw/hug");

    const lonerHug = new MessageEmbed()
      .setColor("DARK_VIVID_PINK")
      .setAuthor({
        name: `${client.user.username} hugs ${interaction.user.username}!`,
        iconURL: `${client.user.avatarURL({ dynamic: true })}`,
      })
      .setImage(body.url)
      .setTimestamp()

    if (target.id === interaction.user.id)
      return interaction.reply({ embeds: [lonerHug] });

    const hugEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setAuthor({
        name: `${interaction.user.username} hugs ${target.user.username}!`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setImage(body.url)
      .setTimestamp();
    interaction.reply({ embeds: [hugEmbed] });
  },
};
