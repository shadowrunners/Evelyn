/* eslint-disable no-unused-vars */
const {
	Client,
	ChatInputCommandInteraction,
	EmbedBuilder,
} = require('discord.js');
const importUtils = require('../../modules/Utils/utils.js');
const { isBlacklisted } = require('../../functions/isBlacklisted.js');

module.exports = {
	name: 'interactionCreate',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const embed = new EmbedBuilder().setColor('Blurple');
		if (!interaction.isChatInputCommand()) return;

		const utils = new importUtils(interaction);
		const command = client.commands.get(interaction.commandName);

		if (await isBlacklisted(interaction)) return;

		if (!command)
			return interaction.reply({
				embeds: [embed.setDescription('This command is outdated.')],
				ephemeral: true,
			});

		if (command.botPermissions) {
			if (utils.check4Perms(command)) return;
		}

		const subCommand = interaction.options.getSubcommand(false);
		if (subCommand) {
			const subCommandFile = client.subCommands.get(
				`${interaction.commandName}.${subCommand}`,
			);

			if (!subCommandFile)
				return interaction.reply({
					embeds: [embed.setDescription('This subcommand is outdated.')],
					ephemeral: true,
				});

			subCommandFile.execute(interaction, client);
		}
		else command.execute(interaction, client);
	},
};
