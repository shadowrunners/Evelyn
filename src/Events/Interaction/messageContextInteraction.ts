import { MessageContextMenuCommandInteraction, EmbedBuilder } from 'discord.js';
import { Event } from '../../Interfaces/interfaces';
import { isBlacklisted } from '../../Functions/isBlacklisted';
import { Evelyn } from '../../structures/Evelyn';

const event: Event = {
	name: 'interactionCreate',
	async execute(
		interaction: MessageContextMenuCommandInteraction,
		client: Evelyn,
	) {
		const { commandName } = interaction;
		if (!interaction.isMessageContextMenuCommand()) return;

		const command = client.commands.get(commandName);
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (await isBlacklisted(interaction)) return;

		if (!command)
			return interaction.reply({
				embeds: [embed.setDescription('🔹 | This command is outdated.')],
				ephemeral: true,
			});

		return command.execute(interaction, client);
	},
};

export default event;
