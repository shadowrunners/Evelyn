const client = require("../../structures/index.js");
const { EmbedBuilder } = require("discord.js");
const pms = require("pretty-ms");
const { magenta, white, red, green } = require("chalk");

module.exports = {
  name: "erelaEvents",
  run: client.manager
    .on("nodeConnect", (node) => {
      console.log(
        magenta("[") +
          magenta("Erela") +
          magenta("]") +
          green(" Node ") +
          white(node.options.identifier) +
          green(" connected!")
      );
    })

    .on("nodeDisconnect", (node) => {
      console.log(
        magenta("[") +
          magenta("Erela") +
          magenta("]") +
          white(` Lost connection to node `) +
          red(`${node.options.identifier}`)
      );
    })

    .on("nodeError", (node, error) => {
      console.log(
        magenta("[") +
          magenta("Erela") +
          magenta("]") +
          red(" An error has occured regarding node ") +
          white(node.options.identifier) +
          red(`: ${error.message}`)
      );
    })

    .on("trackStart", (player, track) => {
      client.channels.cache.get(player.textChannel).send({
        embeds: [
          new EmbedBuilder()
            .setColor("BLURPLE")
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
