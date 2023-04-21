import { UserContextMenuCommandInteraction, EmbedBuilder } from 'discord.js';
import { Event } from '../../interfaces/interfaces.js';
import { Evelyn } from '../../structures/Evelyn.js';
import { isBlacklisted } from '../../functions/isBlacklisted.js';

const event: Event = {
	name: 'interactionCreate',
	async execute(
		interaction: UserContextMenuCommandInteraction,
		client: Evelyn,
	) {
		if (!interaction.isUserContextMenuCommand()) return;

		const command = client.commands.get(interaction.commandName);
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		if (await isBlacklisted(interaction)) return;

		if (!command)
			return interaction.reply({
				embeds: [embed.setDescription('This command is outdated.')],
			});
		else return command.execute(interaction, client);
	},
};

export default event;
