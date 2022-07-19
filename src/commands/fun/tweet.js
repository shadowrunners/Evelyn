const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "tweet",
  description: "Tweet something about someone.",
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

    superagent.get(`https://nekobot.xyz/api/imagegen?type=tweet&username=${interaction.user.username}&text=${text}`)
    .then(function(res) {
        const tweetEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setImage(res.body.message)
            .setTimestamp()
        return interaction.reply({embeds: [tweetEmbed]})
    });
  },
};

