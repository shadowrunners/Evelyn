import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	TextChannel,
} from 'discord.js';
import { RRoles as DB } from '../../../structures/schemas/roles.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'roles.send-panel',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId, guild } = interaction;
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		const panel = options.getString('panel');
		const channel = options.getChannel('channel') as TextChannel;
		const data = await DB.findOne({ id: guildId, panelName: panel });

		if (panel !== data.panelName || data.roleArray.length > 0)
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | The panel you specified does not exist.'),
				],
				ephemeral: true,
			});

		const panelEmbed = new EmbedBuilder()
			.setTitle(`${data.panelName}`)
			.setColor('Blurple');

		const opts = data.roleArray.map((x) => {
			const role = guild.roles.cache.get(x.roleId);

			return {
				label: role.name,
				value: role.id,
				description: x.description,
				emoji: x.emoji || undefined,
			};
		});

		const menuComponents =
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('reaction')
					.setPlaceholder(data.panelName)
					.setMinValues(0)
					.setMaxValues(opts.length)
					.addOptions(opts),
			);

		await channel.send({ embeds: [panelEmbed], components: [menuComponents] });
		return interaction.reply({
			content: '🔹 | Succesfully sent your panel.',
			ephemeral: true,
		});
	},
};

export default subCommand;
