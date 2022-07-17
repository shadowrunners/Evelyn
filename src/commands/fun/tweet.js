const { CommandInteraction, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

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
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply({})
    const text = interaction.options.getString("text");

    fetch(`https://nekobot.xyz/api/imagegen?type=tweet&username=${interaction.user.username}&text=${text}`)
    
    .then(function(result) { return result.json(); })
    .then(function(data) {
        const tweetEmbed = new EmbedBuilder()
            .setColor("BLURPLE")
            .setImage(data.message)
            .setTimestamp()
        interaction.editReply({embeds: [tweetEmbed]})
    });
  },
};

