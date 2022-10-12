async function loadCommands(client) {
  const { magenta, green, white } = require("chalk");
  const { fileLoad } = require("../../utils/fileLoader.js");

  await client.commands.clear();

  const commandsArray = [];
  const developerArray = [];

  const files = await fileLoad("commands");
  files.forEach((file) => {
    const command = require(file);
    client.commands.set(command.data.name, command);

    if (command.developer) developerArray.push(command.data.toJSON());
    else commandsArray.push(command.data.toJSON());

    console.log(
      magenta("[") +
        magenta("Commands") +
        magenta("]") +
        " Loaded" +
        green(` ${command.data.name}.js`)
    );
  });

  client.application.commands.set(commandsArray);

  const developerGuild = client.guilds.cache.get(client.config.devGuild);
  developerGuild.commands.set(developerArray);

  return console.log(
    magenta("[Discord API] ") +
      white("Refreshed application commands for public and developer guilds.")
  );
}

module.exports = { loadCommands };
