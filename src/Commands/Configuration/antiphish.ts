import { Discord, Slash, SlashGroup, SlashOption, SlashChoice } from 'discordx';
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from 'discord.js';
import { GuildDB as DB } from '../../Schemas/guild.js';

@Discord()
@SlashGroup({
	name: 'antiphish',
	description: 'A complete anti-phishing system.',
	defaultMemberPermissions: 'Administrator',
})
@SlashGroup('antiphish')
export class AntiPhish {
	@Slash({
		name: 'toggle',
		description: 'Gives you the ability to toggle anti-phishing on and off.',
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
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (choice === 'enable' && data.antiphishing.enabled === true)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | The anti-phishing system is already enabled.',
					),
				],
				ephemeral: true,
			});

		if (choice === 'disable' && data.antiphishing.enabled === false)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | The anti-phishing system is already disabled.',
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
					'antiphishing.enabled': choice === 'enable',
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription('🔹 | The anti-phishing system has been enabled.'),
			],
			ephemeral: true,
		});
	}
}
