const wait = require("node:timers/promises").setTimeout;

module.exports = {
  name: "playerMove",
  async execute(newChannel, player) {
    if (!newChannel) {
      return player ? player.destroy() : undefined;
    } else {
      player.voiceChannel = newChannel;
      player.pause(true);
      await wait(1000);
      player.pause(false);
    }
  },
};
