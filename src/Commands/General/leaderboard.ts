import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
} from 'discord.js';
import { Command } from '../../interfaces/interfaces';
import { Evelyn } from '../../structures/Evelyn';
import DXP from 'discord-xp';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Lists the top users when it comes to XP.'),
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { guild } = interaction;
		const fetchLB = await DXP.fetchLeaderboard(guild.id, 10);
		const leaderboard = await DXP.computeLeaderboard(client, fetchLB);
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		const mappedLB = leaderboard.map(
			(lb: { position: number; userID: string; level: number; xp: number }) =>
				`**#${lb.position}** • **<@${lb.userID}>** • Level: \`${
					lb.level
				}\` • XP: \`${lb.xp - DXP.xpFor(lb.level)}/${
					DXP.xpFor(lb.level + 1) - DXP.xpFor(lb.level)
				}\``,
		);

		return interaction.reply({
			embeds: [
				embed
					.setTitle(`Leaderboard for ${guild.name}`)
					.setDescription(
						`${mappedLB.join('\n\n')}` ||
							'This leaderboard is empty as there is currently no data to compute the leaderboard.',
					),
			],
		});
	},
};

export default command;
