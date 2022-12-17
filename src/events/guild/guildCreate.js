const { Guild, EmbedBuilder, Client, WebhookClient } = require("discord.js");
const GDB = require("../../structures/schemas/guild.js");

module.exports = {
  name: "guildCreate",
  /**
   * @param {Guild} guild
   * @param {Client} client
   */
  async execute(guild, client) {
    const webhook = new WebhookClient({ url: client.config.debug.watcherHook });

    await GDB.create({ id: guild.id });

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Guild Joined")
      .setDescription(`Evelyn has been added to a new guild.`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: "Name", value: `${guild.name}` },
        { name: "Members", value: `${guild.memberCount} members` },
        { name: "ID", value: `${guild.id}` }
      )
      .setTimestamp();
    return webhook.send({ embeds: [embed] });
  },
};
