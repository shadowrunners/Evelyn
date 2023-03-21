import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { RRoles as DB } from '../../../structures/schemas/roles.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'roles.new-panel',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');

		const panel = options.getString('name');
		const rData = await DB.findOne({ id: guildId, panelName: panel });
		const numberOfPanels = await DB.find({ id: guildId });

		if (rData)
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | A panel with this name already exists.'),
				],
				ephemeral: true,
			});

		if (numberOfPanels.length >= 10)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | You can only have 10 reaction role panels.',
					),
				],
				ephemeral: true,
			});

		await DB.create({
			panelName: panel,
			id: guildId,
		});

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | Your panel ${panel} has been created. You can add roles to it via /roles add-role.`,
				),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
