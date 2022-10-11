module.exports = {
  name: "playerDisconnect",
  async execute(player) {
    player.destroy();
  },
};
