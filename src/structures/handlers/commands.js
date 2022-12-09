async function loadCommands(client) {
  const { magenta, green, white } = require("chalk");
  const { fileLoad } = require("../../functions/fileLoader.js");

  await client.commands.clear();
  await client.subCommands.clear();

  const commandsArray = [];
  const developerArray = [];

  const files = await fileLoad("commands");
  files.forEach((file) => {
    const command = require(file);

    if (command.subCommand)
      return client.subCommands.set(command.subCommand, command);

    client.commands.set(command.data.name, command);

    if (command.developer) developerArray.push(command.data.toJSON());
    else commandsArray.push(command.data.toJSON());

    console.log(
      `${magenta("Commands")} ${white("· Loaded")} ${green(
        `${command.data.name}.js`
      )}`
    );
  });

  client.application.commands.set(commandsArray);

  const developerGuild = client.guilds.cache.get(client.config.debug.devGuild);
  developerGuild.commands.set(developerArray);

  return console.log(
    `${magenta("Discord API")} ${white(
      "· Refreshed application commands for public and developer guilds."
    )}`
  );
}

module.exports = { loadCommands };
