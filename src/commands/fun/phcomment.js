const { CommandInteraction, MessageEmbed } = require("discord.js");
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
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const text = interaction.options.getString("text");

    fetch(`https://nekobot.xyz/api/imagegen?type=phcomment&username=${interaction.user.username}&image=${interaction.user.avatarURL({ format: "png", size: 512 })}&text=${text}`)
    
    .then(function(result) { return result.json(); })
    .then(function(data) {
        const phEmbed = new MessageEmbed()
            .setColor("BLURPLE")
            .setImage(data.message)
            .setTimestamp()
          return interaction.reply({ embeds: [phEmbed] });
    });
  },
};

