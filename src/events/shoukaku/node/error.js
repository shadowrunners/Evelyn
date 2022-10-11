const { magenta, white, red } = require("chalk");

module.exports = {
  name: "error",
  execute(name, error) {
    console.log(
      magenta("[") +
        magenta("Shoukaku") +
        magenta("] ") +
        red("An error has occured regarding node ") +
        white(name) +
        red(`: ${error}.`)
    );
  },
};
