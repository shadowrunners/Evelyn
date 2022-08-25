const client = require("../../structures/index.js");
const wait = require("node:timers/promises").setTimeout;
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "playerMove",
  run: client.manager.on("playerMove", async (player, newChannel) => {
    if (!newChannel) {
      const channel = client.channels.cache.get(player.textChannel);
      if (channel)
        channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Blurple")
              .setDescription(
                "🔹 | I have been kicked from the channel, you could've at least said bye. :c"
              )
              .setFooter({ text: "Bots have feelings too, you know?" })
              .setTimestamp(),
          ],
        });
      return player.destroy();
    } else {
      player.voiceChannel = newChannel;
      await wait(1000);
      player.pause(false);
    }
  }),
};
