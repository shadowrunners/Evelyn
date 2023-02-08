const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
    subCommand: "welcome.manage-embed",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guildId } = interaction;
        const embed = new EmbedBuilder().setColor("Blurple");

        await GDB.findOneAndUpdate({
            id: guildId
        }, {
            $set: {
                "welcome.embed.color": options.getString("color"),
                "welcome.embed.title": options.getString("title"),
                "welcome.embed.description": options.getString("description"),
                "welcome.embed.author.name": options.getString("author-name"),
                "welcome.embed.author.icon_url": options.getString("author-icon"),
                "welcome.embed.footer.text": options.getString("footer-text"),
                "welcome.embed.footer.icon_url": options.getString("footer-icon"),
                "welcome.embed.image.url": options.getString("image"),
                "welcome.embed.thumbnail.url": options.getString("thumbnail"),
                "welcome.embed.messageContent": options.getString("messageContent"),
            },
        });

        return interaction.reply({
            embeds: [embed.setDescription("🔹 | Embed has been updated. Run /welcome embed-preview to see a preview or wait for someone to join.")],
            ephemeral: true
        });
    }
};