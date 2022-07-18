const { Guild } = require("discord.js")
const GDB = require("../../structures/schemas/guildDB.js")
const AMDB = require("../../structures/schemas/automodDB.js");

module.exports = {
    name: "guildDelete",
    once: false,
    /**
     * @param {Guild} guild
     */

    async execute(guild) {
        await GDB.findOneAndDelete({
            id: guild.id,
        });

        await AMDB.findOneAndDelete({
            id: guild.id,
        });
    },
};