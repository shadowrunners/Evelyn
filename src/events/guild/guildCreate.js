const { Guild, MessageEmbed } = require("discord.js");
const GDB = require("../../structures/schemas/guildDB.js");
const AMDB = require("../../structures/schemas/automodDB.js");

module.exports = {
    name: "guildCreate",
    once: false,
    /**
     * @param {Guild} guild
     */

    async execute(guild) {
        await GDB.create({ id: guild.id });
        await AMDB.create({ id: guild.id });

        try { 
            guild.members.cache.get(guild.ownerId)?.send({ embeds: [new MessageEmbed()
                .setColor("BLURPLE")
                .setTitle("Hiya! Thanks for inviting Jinx to your server!")
                .setDescription("We hope you have a fun time!\n\nIf you have any questions, feel free to join our support server [here](https://discord.gg/HwkDSs7X82).")
            ]})
        } catch(err) {};
    },
};