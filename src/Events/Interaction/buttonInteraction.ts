import { Event } from '../../Interfaces/interfaces';
import {
	ButtonInteraction,
	EmbedBuilder,
	PermissionsBitField,
} from 'discord.js';
import { Evelyn } from '../../Structures/Evelyn';
import { isBlacklisted } from '../../Functions/isBlacklisted';

const event: Event = {
	name: 'interactionCreate',
	async execute(interaction: ButtonInteraction, client: Evelyn) {
		const { user, customId, member, guild } = interaction;
		if (!interaction.isButton()) return;

		const embed = new EmbedBuilder().setColor('Blurple');
		const button = client.buttons.get(customId);

		if (!button || button === undefined) return;
		if (await isBlacklisted(interaction)) return;

		const botPerms = PermissionsBitField.resolve(button.botPermissions);
		const userPerms = PermissionsBitField.resolve(button.userPermissions);

		if (
			button.userPermissions &&
			!(member.permissions as PermissionsBitField).has(button.userPermissions)
		)
			return interaction.reply({
				embeds: [
					embed
						.setDescription(
							'🔹 | You don\'t have the required permissions to use this button.',
						)
						.addFields({
							name: 'Missing Permissions',
							value: `> ${userPerms}`,
						}),
				],
				ephemeral: true,
			});

		if (
			button.botPermissions &&
			!guild.members.me.permissions.has(button.botPermissions)
		)
			return interaction.reply({
				embeds: [
					embed
						.setDescription(
							'🔹 | I don\'t have the required permissions to use this button.',
						)
						.addFields({
							name: 'Missing Permissions',
							value: `> ${botPerms}`,
						}),
				],
				ephemeral: true,
			});

		if (button.developer && !client.config.ownerIDs.includes(user.id))
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | This button is only available to developers.',
					),
				],
			});

		return button.execute(interaction, client);
	},
};

export default event;
