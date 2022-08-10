const { Guild, MessageEmbed, WebhookClient } = require("discord.js");
const GDB = require("../../structures/schemas/guildDB.js");
const AMDB = require("../../structures/schemas/automodDB.js");
//const { guildHook } = require("../../structures/config.json");

module.exports = {
  name: "guildDelete",
  once: false,
  /**
   * @param {Guild} guild
   */

  async execute(guild) {
    //const embed = new MessageEmbed()
    // .setColor("BLURPLE")
    //  .setTitle("Guild Left")
    // .setDescription(`Aeolian has been left a guild.`)
    //  .setThumbnail(guild.iconURL({ dynamic: true }))
    //  .addFields(
    //   { name: "Name", value: `${guild.name}` },
    //    { name: "Members", value: `${guild.memberCount} members` },
    //    { name: "ID", value: `${guild.id}` }
    //   )
    //   .setTimestamp();

    //  const webhook = new WebhookClient({ url: guildHook });
    // webhook.send({ embeds: [embed] });

    GDB.findOneAndDelete({
      id: guild.id,
    });

    AMDB.findOneAndDelete({
      id: guild.id,
    });
  },
};
