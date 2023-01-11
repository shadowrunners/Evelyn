const {
	// eslint-disable-next-line no-unused-vars
	Client,
	// eslint-disable-next-line no-unused-vars
	ChatInputCommandInteraction,
	EmbedBuilder,
} = require('discord.js');
const importUtils = require('../../functions/utils.js');
const { isBlacklisted } = require('../../functions/isBlacklisted.js');

module.exports = {
	name: 'interactionCreate',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const utils = new importUtils(interaction);
		const command = client.commands.get(interaction.commandName);
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (await isBlacklisted(interaction)) return;

		if (!command) {
			return interaction.reply({
				embeds: [embed.setDescription('This command is outdated.')],
			});
		}

		if (command.botPermissions) {
			if (utils.check4Perms(command)) return;
		}

		const subCommand = interaction.options.getSubcommand(false);
		if (subCommand) {
			const subCommandFile = client.subCommands.get(
				`${interaction.commandName}.${subCommand}`,
			);

			if (!subCommandFile) {
				return interaction.reply({
					embeds: [embed.setDescription('This subcommand is outdated.')],
					ephemeral: true,
				});
			}

			subCommandFile.execute(interaction, client);
		}
		else command.execute(interaction, client);
	},
};
