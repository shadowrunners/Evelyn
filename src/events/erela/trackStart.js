const client = require("../../structures/index.js");
const { EmbedBuilder } = require("discord.js");
const pms = require("pretty-ms");

module.exports = {
  name: "trackStart",
  run: client.manager.on("trackStart", (player, track) => {
    client.channels.cache.get(player.textChannel).send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(
            `🔹| Now Playing: **[${track.title}](${track.uri})** [<@${
              track.requester.id
            }> - ${pms(track.duration)}]`
          )
          .setTimestamp(),
      ],
    });
  }),
};
