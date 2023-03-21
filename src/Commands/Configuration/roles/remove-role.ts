import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { RRoles as DB } from '../../../structures/schemas/roles.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'roles.remove-role',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple');
		const data = await DB.findOne({ id: guildId });
		const role = options.getRole('role');

		const findRole = data.roleArray.find((r) => r.roleId === role.id);
		if (!findRole)
			return interaction.reply({
				embeds: [
					embed.setDescription(
						'🔹 | This role hasn\'t been added to the roles panel.',
					),
				],
				ephemeral: true,
			});

		await DB.findOneAndUpdate(
			{
				id: guildId,
			},
			{
				$pull: {
					roleArray: {
						roleId: role.id,
					},
				},
			},
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | ${role.name} has been removed from the roles panel.`,
				),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
