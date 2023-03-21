import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { RRoles as DB } from '../../../structures/schemas/roles.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'roles.add-role',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId, guild } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');

		const panel = options.getString('panel');
		const role = options.getRole('role');
		const description = options.getString('description');
		const emoji = options.getString('emoji');

		const rData = await DB.findOne({ id: guildId, panelName: panel });
		const { roleArray } = rData;

		if (role.position >= guild.members.me.roles.highest.position)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | I can\'t assign a role that\'s higher or equal than mine.',
					),
				],
				ephemeral: true,
			});

		if (roleArray.some((r) => r.roleId === role.id))
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | This role has already been added to the panel.',
					),
				],
			});

		if (rData.roleArray.length >= 10)
			return interaction.reply({
				embeds: [embed.setDescription('🔹 | A panel can only have 10 roles.')],
				ephemeral: true,
			});

		await DB.findOneAndUpdate(
			{
				id: guildId,
				panelName: panel,
			},
			{
				$push: {
					roleArray: {
						roleId: role.id,
						description,
						emoji,
					},
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | ${role.name} has been added to the roles panel. If you have already sent out the panel, you will need to re-send it in order for it to update.`,
				),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
