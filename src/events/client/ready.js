const { Client, ActivityType } = require("discord.js");
const { magenta, white, green, red } = require("chalk");
const { loadCommands } = require("../../structures/handlers/commands.js");
const { check4Giveaways } = require("../../functions/check4Giveaways.js");
const { check4Reminders } = require("../../functions/check4Reminders.js");
const { check4Lockdowns } = require("../../functions/check4Lockdowns.js");
const { dash } = require("../../functions/dashServer.js");
const { set } = require("mongoose");
const DXP = require("discord-xp");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  execute(client) {
    loadCommands(client);

    console.log(
      `${magenta("Discord API")} ${white("· Logged in as")} ${green(
        `${client.user.tag}`
      )}`
    );

    client.user.setPresence({
      activities: [
        {
          name: "v4 - Unleashed || dash.evelynbot.ml",
          type: ActivityType.Playing,
        },
      ],
    });

    if (!client.config.database)
      return console.error(
        `${magenta("Evelyn Notification")} ${white("·")} ${red(
          `Couldn't connect to database, please check your config.json file.`
        )}`
      );

    client.statcord.autopost();

    set("strictQuery", true)
      .connect(client.config.database)
      .then(() => {
        console.log(
          `${magenta("Database")} ${white("·")} ${green(
            `${client.user.username}`
          )} ${white("has successfully connected to the database.")}`
        );
      })
      .catch((err) => {
        console.log(err);
      });

    dash(client);
    check4Giveaways(client);
    check4Reminders(client);
    check4Lockdowns(client);
    DXP.setURL(client.config.database);
  },
};
