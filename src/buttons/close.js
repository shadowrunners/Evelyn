const { createTranscript } = require("discord-html-transcripts");
const DB = require("../structures/schemas/ticketDB.js");
const TS = require("../structures/schemas/ticketSetup.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    id: "close",
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
            if (docs.Closed == true)
                return interaction.reply({
                    embeds: [
                        Embed.setDescription(
                            "Ticket is already closed and is pending deletion."
                        ),
                    ],
                    ephemeral: false,
                });
            const attachment = await createTranscript(channel, {
                limit: -1,
                returnBuffer: false,
                fileName: `Ticket -  ${docs.MembersID} - ${docs.TicketID}.html`,
            });
            await DB.updateOne(
                {
                    ChannelID: channel.id,
                },
                {
                    Closed: true,
                }
            );

            await guild.channels.cache
                .get(TSData.Transcripts)
                .send({
                    embeds: [
                        Embed.setTitle(`Ticket Closed`).addFields([
                            {
                                name: "Ticket ID",
                                value: `${docs.TicketID}`,
                                inline: true,
                            },
                            {
                                name: "Type",
                                value: `ticket`,
                                inline: true,
                            },
                            {
                                name: "Opened By",
                                value: `<@!${docs.MembersID[0]}>`,
                                inline: true,
                            },
                            {
                                name: "Open Time",
                                value: `<t:${docs.OpenTime}:R>`,
                                inline: true,
                            },
                            {
                                name: "Closed Time",
                                value: `<t:${parseInt(Date.now() / 1000)}:R>`,
                                inline: true,
                            },
                        ]),
                    ],
                    files: [attachment],
                });

            interaction.reply({
                embeds: [
                    Embed.setDescription(
                        `🔹 | A transcript of your ticket has been saved and can be safely viewed from your DMs.`
                    ),
                ],
            });
            const DMTranscript = new EmbedBuilder()
                .setColor("BLURPLE")
                .setTitle("Ticket Closed")
                .setDescription(`🔹 | Your ticket has been closed and a transcript of it has been saved for you.`)

            await guild.members.cache.get(docs.MembersID[0]).send({ embeds: [DMTranscript], files: [attachment] });

            if (err) return;

            setTimeout(() => {
                channel.delete();
            }, 10 * 1000);
        });
    }
}