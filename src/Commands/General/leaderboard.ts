import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { Evelyn } from '../../Evelyn.js';
import DXP from 'discord-xp';

@Discord()
export class Leaderboard {
	private readonly embed: EmbedBuilder;

	constructor() {
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	}

	@Slash({
		name: 'leaderboard',
		description: 'Lists the top users when it comes to XP.',
	})
	async leaderboard(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { guild } = interaction;
		const fetchLB = await DXP.fetchLeaderboard(guild.id, 10);
		const leaderboard = await DXP.computeLeaderboard(client, fetchLB);

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
				this.embed
					.setTitle(`Leaderboard for ${guild.name}`)
					.setDescription(
						`${mappedLB.join('\n\n')}` ||
							'This leaderboard is empty as there is currently no data to compute the leaderboard.',
					),
			],
		});
	}
}
