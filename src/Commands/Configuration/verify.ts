import { Discord, Slash, SlashGroup, SlashOption, SlashChoice } from 'discordx';
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	Role,
} from 'discord.js';
import { GuildDB as DB } from '../../Schemas/guild.js';

@Discord()
@SlashGroup({
	name: 'verify',
	description: 'Manage and configure verificatin system.',
	defaultMemberPermissions: 'Administrator',
})
@SlashGroup('verify')
export class Verify {
	@Slash({
		name: 'toggle',
		description: 'Gives you the ability to toggle verification on and off.',
	})
	async toggle(
		@SlashChoice({ name: 'Enable', value: 'enable' })
		@SlashChoice({ name: 'Disable', value: 'disable' })
		@SlashOption({
			description: 'Select one of the choices.',
			name: 'choice',
			required: true,
			type: ApplicationCommandOptionType.String,
		})
			choice: string,
			interaction: ChatInputCommandInteraction,
	) {
		const { guildId } = interaction;
		const data = await DB.findOne({ id: guildId });
		const embed = new EmbedBuilder().setColor('Blurple');

		if (choice === 'enable' && data.verification.enabled === true)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | The verification system is already enabled.',
					),
				],
				ephemeral: true,
			});

		if (choice === 'disable' && data.verification.enabled === false)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | The verification system is already disabled.',
					),
				],
				ephemeral: true,
			});

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'verification.enabled': choice === 'enable',
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | The verification system has been ${
						choice === 'enable' ? 'enabled' : 'disabled'
					}.`,
				),
			],
			ephemeral: true,
		});
	}

	@Slash({
		name: 'setrole',
		description:
			'Sets the role that will be assigned to users after they pass verification.',
	})
	async setrole(
		@SlashOption({
			name: 'verifyrole',
			description: 'Provide the role.',
			required: true,
			type: ApplicationCommandOptionType.Role,
		})
			verifyrole: Role,
			interaction: ChatInputCommandInteraction,
	) {
		const { guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$set: {
					'verification.role': verifyrole.id,
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | Got it, the <@&${verifyrole.id}> will now be assigned to users who pass verification.`,
				),
			],
			ephemeral: true,
		});
	}
}
