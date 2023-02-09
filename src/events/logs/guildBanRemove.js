const { GuildMember, EmbedBuilder, AuditLogEvent } = require("discord.js");
const { webhookDelivery } = require("../../functions/webhookDelivery.js");
const DB = require("../../structures/schemas/guild.js");
const { MemberBanRemove } = AuditLogEvent;

module.exports = {
    name: "guildBanRemove",
    /**
     * @param {GuildMember} member
     */
    async execute(member) {
        const { guild, user } = member;

        const data = await DB.findOne({
            id: guild.id,
        });

        if (!data.logs.channel || !data.logs.webhook) return;

        const fetchLogs = await guild.fetchAuditLogs({
            type: MemberBanRemove,
            limit: 1,
        });
        const firstLog = fetchLogs.entries.first();

        const embed = new EmbedBuilder().setColor("Blurple");

        return webhookDelivery(
            data,
            embed
                .setAuthor({
                    name: guild.name,
                    iconURL: guild.iconURL()
                })
                .setTitle("Member Unbanned")
                .addFields(
                    {
                        name: "🔹 | Member Name",
                        value: `> ${user.username}`,
                    },
                    {
                        name: "🔹 | Member ID",
                        value: `> ${user.id}`,
                    },
                    {
                        name: "🔹 | Unbanned by",
                        value: `> <@${firstLog.executor.id}>`
                    },
                ),
        );
    },
};