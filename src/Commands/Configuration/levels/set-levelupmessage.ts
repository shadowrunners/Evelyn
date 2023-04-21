import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'levels.set-levelupmessage',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId } = interaction;
		const providedMessage = options.getString('message');
		const embed = new EmbedBuilder().setColor('Blurple');

		await DB.findOneAndUpdate(
			{ id: guildId },
			{ $set: { 'levels.message': providedMessage } },
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					'🔹 | Got it, the level up message you provided has been set.',
				),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
