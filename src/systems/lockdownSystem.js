const { Client } = require("discord.js")
const DB = require("../structures/schemas/lockdownDB.js");

/**
 * @param {Client} client
 */

module.exports = async (client) => {
    DB.find().then(async (documentsArray) => {
        documentsArray.forEach(async (d) => {
            const channel = client.guilds.cache.get(d.GuildID).channels.cache.get(d.ChannelID);
            if(!channel) return;

            const timenow = Date.now();
            if(d.time < timenow) {
                channel.permissionOverwrites.edit(d.GuildID, {
                    SEND_MESSAGES: null,
                });
                return await DB.deleteOne({ChannelID: channel.id});
            }

            const expiredate = d.time - Date.now();

            setTimeout(async () => {
                channel.permissionOverwrites.edit(d.GuildID, {
                    SEND_MESSAGES: null,
                });
                await DB.deleteOne({ChannelID: channel.id});
            }, expiredate);
        })
    })
}