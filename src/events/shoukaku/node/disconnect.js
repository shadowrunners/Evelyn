const { magenta, white, red } = require("chalk");

module.exports = {
  name: "disconnect",
  execute(name, players, moved) {
    if (moved) return;
    players.map((player) => player.connection.disconnect());
    console.log(
      magenta("[") +
        magenta("Shoukaku") +
        magenta("] ") +
        white(`Lost connection to node`) +
        red(` ${name}.`)
    );
  },
};
