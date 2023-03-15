import { Event } from '../../interfaces/interfaces';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Evelyn } from '../../structures/Evelyn';
//import importUtils from '../../modules/Utils/utils.js';
//import { isBlacklisted } from '../../functions/isBlacklisted.js';

const event: Event = {
	name: "interactionCreate",
	execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		if (!interaction.isChatInputCommand()) return;
		const { options, commandName } = interaction;

		const embed = new EmbedBuilder().setColor('Blurple');

		// const utils = new importUtils(interaction);
		const command = client.commands.get(commandName);

		// if (await isBlacklisted(interaction)) return;

		if (!command)
			return interaction.reply({
				embeds: [embed.setDescription('This command is outdated.')],
				ephemeral: true,
			});

		//if (command.botPermissions) {
			//if (utils.check4Perms(command)) return;
		//}

		const subCommand = options.getSubcommand(false); 
		console.log(subCommand);
		if (subCommand) {
			const subCommandFile = client.subCommands.get(`${commandName}.${subCommand}`);

			console.log(subCommandFile);
			console.log(commandName);
			console.log(subCommand);

			//if (!subCommandFile)
			//	return interaction.reply({
			//		embeds: [embed.setDescription('This subcommand is outdated.')],
			//		ephemeral: true,
			//	});

			subCommandFile.execute(interaction, client);
		} else command.execute(interaction, client);
	},
};

export default event;
