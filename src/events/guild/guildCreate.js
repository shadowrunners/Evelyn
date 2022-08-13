const { Guild, EmbedBuilder, WebhookClient } = require("discord.js");
const GDB = require("../../structures/schemas/guildDB.js");
const AMDB = require("../../structures/schemas/automodDB.js");
//const { guildHook } = require("../../structures/config.json");

module.exports = {
  name: "guildCreate",
  once: false,
  /**
   * @param {Guild} guild
   */

  async execute(guild) {
    await GDB.create({ id: guild.id });
    await AMDB.create({ id: guild.id });

    //const embed = new MessageEmbed()
    //   .setColor("BLURPLE")
    //  .setTitle("Guild Joined")
    //  .setDescription(`Aeolian has been added to a new guild.`)
    //  .setThumbnail(guild.iconURL({ dynamic: true }))
    //  .addFields(
    //     { name: "Name", value: `${guild.name}` },
    //     { name: "Members", value: `${guild.memberCount} members` },
    //    { name: "ID", value: `${guild.id}` }
    //  )
    //   .setTimestamp();

    //  const webhook = new WebhookClient({ url: guildHook });
    //  webhook.send({ embeds: [embed] });

    try {
      guild.members.cache.get(guild.ownerId)?.send({
        embeds: [
          new EmbedBuilder()
            .setColor("BLURPLE")
            .setTitle("Hiya! Thanks for inviting Aeolian to your server!")
            .setDescription(
              "We hope you have a fun time!\n\nIf you have any questions, feel free to join our support server [here](https://discord.gg/HwkDSs7X82)."
            )
            .setTimestamp(),
        ],
      });
    } catch (err) {}
  },
};
