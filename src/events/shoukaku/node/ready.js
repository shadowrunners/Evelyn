const { magenta, white, green } = require("chalk");

module.exports = {
  name: "ready",
  execute(name) {
    console.log(
      magenta("[") +
        magenta("Shoukaku") +
        magenta("]") +
        green(" Node ") +
        white(`${name}`) +
        green(" connected!")
    );
  },
};
