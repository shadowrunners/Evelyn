const { ChatInputCommandInteraction, EmbedBuilder, Client } = require("discord.js");
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
    subCommand: "logs.set-channel",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options, guildId } = interaction;
        const channel = options.getChannel("channel");
        const embed = new EmbedBuilder().setColor("Blurple");
        const data = await GDB.findOne({ id: guildId });

        await interaction.deferReply({ ephemeral: true });

        if (data.logs?.channel) {
            const fetchWebhook = await client.fetchWebhook(data.logs?.webhook?.id, data.logs?.webhook?.token);
            await fetchWebhook.delete();

            channel.createWebhook({
                name: client.user.username,
                avatar: client.user.avatarURL()
            }).then(async (webhook) => {
                await GDB.findOneAndUpdate({
                    id: guildId
                }, {
                    $set: {
                        'logs.webhook.id': webhook.id,
                        'logs.webhook.token': webhook.token
                    },
                });
            });
        } else {
            channel.createWebhook({
                name: client.user.username,
                avatar: client.user.avatarURL()
            }).then(async (webhook) => {
                await GDB.findOneAndUpdate({
                    id: guildId
                }, {
                    $set: {
                        'logs.webhook.id': webhook.id,
                        'logs.webhook.token': webhook.token
                    },
                });
            });
        };

        return interaction.editReply({
            embeds: [embed.setDescription(`🔹 | Got it, logs will now be sent to: <#${channel.id}>.`)]
        });
    }
}