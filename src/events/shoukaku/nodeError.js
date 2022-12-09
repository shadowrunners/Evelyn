const { magenta, white, red } = require("chalk");

module.exports = {
  name: "error",
  shoukaku: true,
  execute(name, error) {
    console.log(
      `${magenta("Lavalink")} ${white(
        "· An error has occured regarding node"
      )} ${white(name)} ${red(`${error.message}.`)}`
    );
  },
};
