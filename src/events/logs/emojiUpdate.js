const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const { GuildEmoji, EmbedBuilder, AuditLogEvent } = require("discord.js");
const DB = require("../../structures/schemas/guild.js");
const { EmojiUpdate } = AuditLogEvent;

module.exports = {
    name: "emojiUpdate",
    /**
     * @param {GuildEmoji} oldEmoji
     * @param {GuildEmoji} newEmoji
     */
    async execute(oldEmoji, newEmoji) {
        const { guild } = oldEmoji;

        const data = await DB.findOne({
            id: guild.id,
        });

        if (!data.logs.enabled || !data.logs.webhook) return;

        const fetchLogs = await guild.fetchAuditLogs({
            type: EmojiUpdate,
            limit: 1,
        });
        const firstLog = fetchLogs.entries.first();

        const embed = new EmbedBuilder().setColor("Blurple");

        if (oldEmoji.name !== newEmoji.name)
            return webhookDelivery(
                data,
                embed
                    .setAuthor({
                        name: guild.name,
                        iconURL: guild.iconURL()
                    })
                    .setTitle("Emoji Updated")
                    .addFields(
                        {
                            name: "🔹 | Old Name",
                            value: `> ${oldEmoji.name}`,
                        },
                        {
                            name: "🔹 | New Name",
                            value: `> ${newEmoji.name}`,
                        },
                        {
                            name: "🔹 | Updated by",
                            value: `> <@${firstLog.executor.id}>`,
                        },
                    ),
            )
    }
}