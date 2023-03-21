import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { RRoles as DB } from '../../../structures/schemas/roles.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'roles.list-panels',
	async execute(interaction: ChatInputCommandInteraction) {
		const { guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');
		const data = await DB.find({ id: guildId });

		await interaction.deferReply();

		if (!data) return;

		data.forEach((docs) => {
			const roleArray = docs.roleArray
				.map((role) => {
					return `<@&${role.roleId}>`;
				})
				.join('\n');

			embed.addFields({ name: docs.panelName, value: roleArray });
			return interaction.editReply({ embeds: [embed] });
		});
	},
};

export default subCommand;
