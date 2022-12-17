const { Client } = require("discord.js");

module.exports = {
  name: "ready",
  /**
   * @param {Client} client 
   */
  execute(client) {
    console.log("Economy system initialized.");
  },
};
