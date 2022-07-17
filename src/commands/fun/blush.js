const { CommandInteraction, MessageEmbed } = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "blush",
  description: ":flushed: but in glorious GIF form.",
  public: true,
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { body } = await superagent.get("https://api.waifu.pics/sfw/blush");

    const blushEmbed = new MessageEmbed()
      .setColor("DARK_VIVID_PINK")
      .setAuthor({
        name: `${interaction.user.username} blushes!`,
        iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
      })
      .setImage(body.url)
      .setTimestamp();
      
    interaction.reply({ embeds: [blushEmbed] });
  },
};
