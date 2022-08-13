const { readdirSync } = require("fs");
const { magenta, green, white } = require("chalk");

function loadCommands(client) {
  let commandsArray = [];
  let developerArray = [];

  const commandsFolder = readdirSync("./src/commands");
  for (const folder of commandsFolder) {
    const commandFiles = readdirSync(`./src/commands/${folder}`).filter(
      (file) => file.endsWith(".js")
    );

    for (const file of commandFiles) {
      const commandFile = require(`../../commands/${folder}/${file}`);

      client.commands.set(commandFile.data.name, commandFile);

      if (commandFile.developer) developerArray.push(commandFile.data.toJSON());
      else commandsArray.push(commandFile.data.toJSON());

      console.log(
        magenta("[") +
          magenta("Commands") +
          magenta("]") +
          " Loaded" +
          green(` ${commandFile.data.name}.js`)
      );
      continue;
    }
  }
  client.application.commands.set(commandsArray);

  const developerGuild = client.guilds.cache.get(client.config.devGuild);
  developerGuild.commands.set(developerArray);

  return console.log(
    magenta("[Discord API] ") +
      white("Refreshed application commands for public and developer guilds.")
  );
}

module.exports = { loadCommands };
