import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';

const subCommand: Subcommand = {
	subCommand: 'goodbye.set-channel',
	async execute(interaction: ChatInputCommandInteraction) {
		const { options, guildId } = interaction;
		const channel = options.getChannel('channel');
		const embed = new EmbedBuilder().setColor('Blurple');

		await DB.findOneAndUpdate(
			{ id: guildId },
			{ $set: { 'goodbye.channel': channel.id } },
		);

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | Got it, goodbye messages will now be sent to: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
