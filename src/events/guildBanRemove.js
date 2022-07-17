const { Client, GuildChannel, MessageEmbed } = require("discord.js");
const DB = require("../../structures/schemas/guildDB.js");

module.exports = {
    name: "guildBanRemove",
    /**
     * @param {GuildChannel} channel
     * @param {Client} client
    */
    async execute(channel, client) {
        const data = await DB.findOne({
            id: channel.guild.id,
        });

        if (!data) return;
        if (data.logs.enabled == "false" || data.logs.channel == null) return;

        const allLogs = await channel.guild.fetchAuditLogs({ type: "MEMBER_BAN_REMOVE", limit: 1 });
        const fetchLogs = allLogs.entries.first();

        const embed = new MessageEmbed()
            .setColor("DARK_VIVID_PINK")
            .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL() })
            .setTitle("Member Unbanned")
            .addFields(
                {
                    name: "Member Name",
                    value: `${fetchLogs.target.username}#${fetchLogs.target.discriminator} (${fetchLogs.target.id})`,
                },
                {
                    name: "Reason",
                    value: fetchLogs.reason || 'Not provided.',
                },
                {
                    name: "Unbanned by",
                    value: `<@${fetchLogs.executor.id}> (${fetchLogs.executor.id})`,
                },
                {
                    name: "Were they unbanned by a bot?",
                    value: fetchLogs.executor.bot ? "Yes." : "No.",
                },
            )
            .setTimestamp()
        client.channels.cache.get(data.Channel).send({ embeds: [embed] });
    }
}