import { Event } from '../../interfaces/interfaces.js';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Evelyn } from '../../structures/Evelyn.js';
import { Util } from '../../modules/Utils/utils.js';
import { isBlacklisted } from '../../functions/isBlacklisted.js';

const event: Event = {
	name: 'interactionCreate',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		if (!interaction.isChatInputCommand()) return;
		const { options, commandName } = interaction;

		const embed = new EmbedBuilder().setColor('Blurple');

		const utils = new Util(interaction);
		const command = client.commands.get(commandName);

		if (await isBlacklisted(interaction)) return;

		if (!command)
			return interaction.reply({
				embeds: [embed.setDescription('This command is outdated.')],
				ephemeral: true,
			});

		if (command.botPermissions) {
			if (utils.checkPermissions(command)) return;
		}

		const subCommand = options.getSubcommand(false);
		if (subCommand) {
			const subCommandFile = client.subCommands.get(
				`${commandName}.${subCommand}`,
			);

			// if (!subCommandFile)
			//	return interaction.reply({
			//		embeds: [embed.setDescription('This subcommand is outdated.')],
			//		ephemeral: true,
			//	});

			return subCommandFile.execute(interaction, client);
		}
		else return command.execute(interaction, client);
	},
};

export default event;
