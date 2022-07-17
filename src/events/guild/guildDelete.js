const { Guild } = require("discord.js")
const GDB = require("../../structures/schemas/guildDB.js")
const AMDB = require("../../structures/schemas/automodDB.js");

module.exports = {
    name: "guildCreate",
    once: false,
    /**
     * @param {Guild} guild
     */

    async execute(guild) {
        GDB.findOneAndDelete({
            id: guild.id,
        });

        AMDB.findOneAndDelete({
            id: guild.id,
        });
    },
};