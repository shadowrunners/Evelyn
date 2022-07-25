const { Client, ActivityType } = require("discord.js");
const { magenta, white, green, red } = require("chalk");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  execute(client) {
    console.log(
      magenta("[Discord API] ") +
        white("Logged in as ") +
        green(`${client.user.tag}`)
    );
    client.user.setPresence({
      activities: [
        { name: "Fly Me to The Moon", type: ActivityType.Listening },
      ],
      status: "online",
    });
  },
};
