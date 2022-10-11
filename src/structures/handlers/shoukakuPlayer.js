async function loadShoukakuPlayer(client) {
  const { magenta, green } = require("chalk");
  const { fileLoad } = require("../../utils/fileLoader.js");

  const files = await fileLoad("events/shoukaku/player");
  files.forEach((file) => {
    const event = require(file);
    const execute = (...args) => event.execute(...args, client);

    client.manager.on(event.name, execute);

    return console.log(
      magenta("[") +
        magenta("Shoukaku") +
        magenta("]") +
        " Loaded " +
        green(`${event.name}.js`)
    );
  });
}

module.exports = { loadShoukakuPlayer };
