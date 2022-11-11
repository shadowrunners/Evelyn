async function loadPoru(client) {
  const { magenta, white, green } = require("chalk");
  const { fileLoad } = require("../../utils/fileLoader.js");

  const files = await fileLoad("events/poru");
  files.forEach((file) => {
    const event = require(file);
    const execute = (...args) => event.execute(...args, client);

    client.manager.on(event.name, execute);

    return console.log(
      magenta("Poru") + white(" · ") + "Loaded " + green(`${event.name}.js`)
    );
  });
}

module.exports = { loadPoru };
