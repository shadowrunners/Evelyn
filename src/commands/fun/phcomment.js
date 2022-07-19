const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");
const fetch = require("node-fetch");

module.exports = {
  name: "phcomment",
  description: "Write a spicy PH comment on your behalf.",
  public: true,
  options: [
    {
      name: "text",
      description: "Provide the text for the comment.",
      type: 3,
      required: true,
    },
  ],
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const text = interaction.options.getString("text");
    
    superagent.get(`https://nekobot.xyz/api/imagegen?type=phcomment&username=${interaction.user.username}&image=${interaction.user.avatarURL({ format: "png", size: 512 })}&text=${text}`)
    .then(function(res) {
      const phEmbed = new EmbedBuilder()
        .setColor("Grey")
        .setImage(res.body.message)
        .setTimestamp()
      return interaction.reply({ embeds: [phEmbed] });
    });
  }
};

