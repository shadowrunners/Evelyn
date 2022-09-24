async function loadErela(client) {
  const { magenta, green } = require("chalk");
  const { fileLoad } = require("../../utils/fileLoader.js");

  const files = await fileLoad("events/erela");
  files.forEach((file) => {
    const event = require(file);
    const execute = (...args) => event.execute(...args, client);

    client.manager.on(event.name, execute);

    return console.log(
      magenta("[") +
        magenta("Erela") +
        magenta("]") +
        " Loaded " +
        green(`${event.name}.js`)
    );
  });
}

module.exports = { loadErela };
