import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	AttachmentBuilder,
	GuildMember,
} from 'discord.js';
import { Command } from '../../Interfaces/interfaces.js';
import { profileImage } from 'discord-arts';
import DXP from 'discord-xp';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Displays the rank of a user.')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('Provide a user.')
				.setRequired(false),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, member, guildId } = interaction;
		const target = options.getUser('target') || (member as GuildMember);
		const user = await DXP.fetch(target.id, guildId, true);

		if (!user)
			return interaction.reply({
				content: '🔹 | This user hasn\'t gained any XP yet.',
				ephemeral: true,
			});

		const requiredlvl = DXP.xpFor(user.level + 1);
		const rankCard = await profileImage(target.id, {
			rankData: {
				currentXp: user.xp,
				requiredXp: requiredlvl,
				//	rank: user.,
				level: user.level,
				barColor: '5865F2',
			},
		});
		const attachment = new AttachmentBuilder(rankCard, { name: 'card.png' });

		return interaction.editReply({
			files: [attachment],
		});
	},
};

export default command;
