import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	Role,
	Guild,
} from 'discord.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'server.roles',
	execute(interaction: ChatInputCommandInteraction) {
		const { guild } = interaction;
		const definedGuild = guild as Guild;
		const { name, roles } = definedGuild;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		const sortedRoles = roles.cache
			.map((role) => role)
			.slice(1, roles.cache.size)
			.sort((a, b) => b.position - a.position);
		const userRoles = sortedRoles.filter((role) => !role.managed);
		const managedRoles = sortedRoles.filter((role) => role.managed);

		// eslint-disable-next-line no-shadow
		const maxDisplayRoles = (roles: Role[], maxFieldLength = 1024) => {
			let totalLength = 0;
			const result = [];

			for (const role of roles) {
				const roleString = `<@&${role.id}>`;

				if (roleString.length + totalLength > maxFieldLength) break;

				totalLength += roleString.length + 1;
				result.push(roleString);
			}

			return result.length;
		};

		return interaction.reply({
			embeds: [
				embed
					.setTitle(`Roles | ${name}`)
					.addFields(
						{
							name: 'User Roles',
							value: `> ${
								userRoles.slice(0, maxDisplayRoles(userRoles)).join(' ') ||
								'None'
							}`,
						},
						{
							name: 'Managed Roles',
							value: `> ${
								managedRoles
									.slice(0, maxDisplayRoles(managedRoles))
									.join(' ') || 'None'
							}`,
						},
					)
					.setThumbnail(guild.iconURL({ size: 1024 })),
			],
		});
	},
};

export default subCommand;
