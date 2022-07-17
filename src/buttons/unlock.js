const DB = require("../structures/schemas/ticketDB.js");
const TS = require("../structures/schemas/ticketSetup.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    id: "unlock",
    async execute(interaction) {
        const { guild, channel, member } = interaction;
        const Embed = new EmbedBuilder().setColor("BLURPLE");

        const TSData = await TS.findOne({ GuildID: guild.id });
        if (!TSData) return interaction.reply({ content: "The data for this system is outdated.", ephemeral: true });
        if (!member.roles.cache.find((r) => r.id === TSData.Handlers)) return interaction.reply({ content: "You can't use these buttons.", ephemeral: true });

        DB.findOne({ ChannelID: channel.id }, async (err, docs) => {
            if (err) throw err;
            if (!docs)
                return interaction.reply({
                    content: "No data was found regarding this ticket, please delete it manually.",
                    ephemeral: true,
                });
            if (docs.Locked == false)
                return interaction.reply({
                    content: "🔓 | This ticket is already unlocked.",
                    ephemeral: true,
                });
            await DB.updateOne({ ChannelID: channel.id }, { Locked: false });
            Embed.setDescription("🔒 | This ticket has been unlocked.");
            docs.MembersID.forEach((m) => {
                channel.permissionOverwrites.edit(m, {
                    SEND_MESSAGES: true,
                });
            });
            interaction.reply({ embeds: [Embed] });
        });
    }
}