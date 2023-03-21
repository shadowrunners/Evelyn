import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'tickets.configure',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId } = interaction;
		const category = options.getChannel('category');
		const transcripts = options.getChannel('transcripts');
		const assistantRole = options.getRole('assistant-role');
		const embed = new EmbedBuilder().setColor('Blurple');

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'tickets.category': category.id,
					'tickets.transcripts': transcripts.id,
					'tickets.assistantRole': assistantRole.id,
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setTitle('Configuration Updated').addFields(
					{
						name: '🔹 | Category',
						value: `> ${category.name}`,
					},
					{
						name: '🔹 | Transcripts Channel',
						value: `> <#${transcripts.id}>`,
					},
					{
						name: '🔹 | Assistant Role',
						value: `> <@&${assistantRole.id}>`,
					},
				),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
