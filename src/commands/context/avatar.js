const {
	EmbedBuilder,
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	// eslint-disable-next-line no-unused-vars
	UserContextMenuCommandInteraction,
} = require('discord.js');

module.exports = {
	botPermissions: ['SendMessages', 'EmbedLinks'],
	data: new ContextMenuCommandBuilder()
		.setName('User Avatar')
		.setType(ApplicationCommandType.User),
	/**
	 * @param {UserContextMenuCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { guild, targetId } = interaction;
		const target = await guild.members.fetch(targetId);
		const { user } = target;

		await user.fetch();

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('Blurple')
					.setTitle(`${user.tag}'s Avatar`)
					.setImage(user.avatarURL({ dynamic: true, size: 2048 }))
					.setURL(user.avatarURL()),
			],
			ephemeral: true,
		});
	},
};
