const { CommandInteraction, EmbedBuilder } = require("discord.js");
const DB = require("../../structures/schemas/lockdownDB.js");

module.exports = {
	name: 'unlock',
	description: '🔒 Lifts the lockdown off a channel.',
	permissions: 'MANAGE_CHANNELS',
    public: true,
	/**
	 * @param {CommandInteraction} interaction 
	 */
	async execute (interaction) {
        const { guild, channel } = interaction;
        const Embed = new EmbedBuilder()

        if(channel.permissionsFor(guild.id).has("SEND_MESSAGES")) return interaction.reply({embeds: [Embed.setColor("BLURPLE").setDescription("This channel is not under lockdown.")]});
        channel.permissionOverwrites.edit(guild.id, {
            SEND_MESSAGES: null,
        })

        await DB.deleteOne({ChannelID: channel.id});
        interaction.reply({embeds: [Embed.setColor("Grey").setDescription("Lockdown has been lifted.")]});
    }
};
