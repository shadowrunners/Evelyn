import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	TextChannel,
} from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'levels.set-channel',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId } = interaction;
		const channel = options.getChannel('channel') as TextChannel;
		const embed = new EmbedBuilder().setColor('Blurple');

		await DB.findOneAndUpdate(
			{ id: guildId },
			{ $set: { 'levels.channel': channel.id } },
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | Got it, the level up messages will now be sent to: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
