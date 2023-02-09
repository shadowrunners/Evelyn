const { ChatInputCommandInteraction, EmbedBuilder, Client } = require("discord.js");
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
    subCommand: "confessions.set-channel",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options, guildId } = interaction;
        const channel = options.getChannel("channel");
        const embed = new EmbedBuilder().setColor("Blurple");
        const data = await GDB.findOne({ id: guildId });

        if (data.confessions?.channel) {
            const fetchWebhook = await client.fetchWebhook(data.confessions?.webhook?.id, data.confessions?.webhook?.token);
            await fetchWebhook.delete();

            channel.createWebhook({
                name: `${client.user.username} · Confessions`,
                avatar: client.user.avatarURL()
            }).then(async (webhook) => {
                await GDB.findOneAndUpdate({
                    id: guildId
                }, {
                    $set: {
                        'confessions.webhook.id': webhook.id,
                        'confessions.webhook.token': webhook.token
                    },
                });
            });
        } else {
            channel.createWebhook({
                name: `${client.user.username} · Confessions`,
                avatar: client.user.avatarURL()
            }).then(async (webhook) => {
                await GDB.findOneAndUpdate({
                    id: guildId
                }, {
                    $set: {
                        'confessions.webhook.id': webhook.id,
                        'confessions.webhook.token': webhook.token
                    },
                });
            });
        };

        return interaction.reply({
            embeds: [embed.setDescription(`🔹 | Got it, confessions will now be sent to: <#${channel.id}>.`)],
            ephemeral: true,
        });
    }
}