import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	AttachmentBuilder,
	GuildMember,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { profileImage } from 'discord-arts';
import DXP from 'discord-xp';

@Discord()
export class Rank {
	@Slash({
		name: 'rank',
		description: 'Displays the rank of a user.',
	})
	async rank(
		@SlashOption({
			name: 'target',
			description: 'Provide a user.',
			type: ApplicationCommandOptionType.User,
			required: false,
		})
			target: GuildMember,
			interaction: ChatInputCommandInteraction,
	) {
		const { guildId, member } = interaction;
		const actualUser = target?.user?.id || (member as GuildMember).user.id;
		const XPuser = await DXP.fetch(actualUser, guildId, true);

		if (!XPuser)
			return interaction.reply({
				content: '🔹 | This user hasn\'t gained any XP yet.',
				ephemeral: true,
			});

		const requiredlvl = DXP.xpFor(parseInt(XPuser.level.toString()) + 1);
		const rankCard = await profileImage(actualUser, {
			rankData: {
				currentXp: XPuser.xp,
				requiredXp: requiredlvl,
				level: XPuser.level,
				barColor: '5865F2',
			},
		});
		const attachment = new AttachmentBuilder(rankCard, { name: 'card.png' });

		return interaction.reply({
			files: [attachment],
		});
	}
}
