import { Discord, Slash, SlashGroup, SlashOption, SlashChoice } from 'discordx';
import {
	EmbedBuilder,
	PermissionFlagsBits,
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
} from 'discord.js';
import { GuildDB as DB } from '../../Schemas/guild.js';
const { Administrator } = PermissionFlagsBits;

@Discord()
@SlashGroup({
	description: 'A complete anti-phishing system.',
	name: 'antiphish',
})
@SlashGroup('antiphish')
export class AntiPhish {
	private embed: EmbedBuilder;

	constructor() {
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	}

	@Slash({
		description: 'Gives you the ability to toggle anti-phishing on and off.',
		defaultMemberPermissions: [Administrator],
		name: 'toggle',
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

		if (choice === 'enable' && data.antiphishing.enabled === true)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | The anti-phishing system is already enabled.',
					),
				],
				ephemeral: true,
			});

		if (choice === 'disable' && data.antiphishing.enabled === false)
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
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
					'antiphishing.enabled': choice === 'enable' ?? choice === 'false',
				},
			},
		);

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					'🔹 | The anti-phishing system has been enabled.',
				),
			],
			ephemeral: true,
		});
	}
}
