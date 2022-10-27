const { EmbedBuilder } = require("discord.js");
const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();
const { get } = require("superagent");

function catto(interaction, client) {
  get("https://api.thecatapi.com/v1/images/search", {
    headers: {
      "x-api-key": client.config.cattoKey,
    },
  }).then(function (res) {
    return interaction.reply({ embeds: [embed.setImage(res.body[0].url)] });
  });
}

module.exports = { catto };
