const { magenta, white, green } = require("chalk");

module.exports = {
  name: "playerDestroy",
  execute() {
    console.log(
      magenta("Lavalink") + white(" · ") + green(`Player destroyed.`)
    );
  },
};
