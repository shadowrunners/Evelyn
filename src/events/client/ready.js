const { Client, ActivityType } = require("discord.js");
const { magenta, white, green, red } = require("chalk");
const DXP = require("discord-xp");
const { loadCommands } = require("../../structures/handlers/commands.js");
const giveawayEnd = require("../../utils/giveawaySystem.js");
const { dash } = require("../../engines/CCEngine.js");
const { connect } = require("mongoose");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  execute(client) {
    console.log(
      magenta("Discord API") +
        white(" · Logged in as ") +
        green(`${client.user.tag}`)
    );

    loadCommands(client);

    client.user.setPresence({
      activities: [
        { name: "Fly Me to The Moon", type: ActivityType.Listening },
      ],
      status: "online",
    });

    if (!client.config.database)
      return console.log(
        magenta("Evelyn Notification") +
          white(" · ") +
          red(
            "Couldn't connect to database, please check your config.json file."
          )
      );

<<<<<<< Updated upstream
    giveawayEnd(client);
=======
<<<<<<< Updated upstream
=======
    client.manager.init(client);

    giveawayEnd(client);
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    dash(client);
    DXP.setURL(client.config.database);

    connect(client.config.database)
      .then(() => {
        console.log(
          magenta("Database") +
            white(" · ") +
            green(`${client.user.username} `) +
            white("has successfully connected to the database.")
        );
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
