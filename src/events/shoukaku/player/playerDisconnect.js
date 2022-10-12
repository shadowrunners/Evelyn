module.exports = {
  name: "playerDisconnect",
  execute(player) {
    player.destroy();
  },
};
