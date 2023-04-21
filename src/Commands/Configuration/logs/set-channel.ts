import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	TextChannel,
} from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';
import { Evelyn } from '../../../structures/Evelyn.js';

const subCommand: Subcommand = {
	subCommand: 'logs.set-channel',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { options, guildId } = interaction;
		const { user } = client;

		const channel = options.getChannel('channel') as TextChannel;
		const embed = new EmbedBuilder().setColor('Blurple');
		const data = await DB.findOne({ id: guildId });

		await interaction.deferReply({ ephemeral: true });

		if (data.logs?.channel) {
			const fetchWebhook = await client.fetchWebhook(
				data.logs?.webhook?.id,
				data.logs?.webhook?.token,
			);
			await fetchWebhook.delete();

			channel
				.createWebhook({
					name: user.username,
					avatar: user.avatarURL(),
				})
				.then(async (webhook) => {
					await DB.findOneAndUpdate(
						{
							id: guildId,
						},
						{
							$set: {
								'logs.webhook.id': webhook.id,
								'logs.webhook.token': webhook.token,
							},
						},
					);
				});
		}
		else {
			channel
				.createWebhook({
					name: user.username,
					avatar: user.avatarURL(),
				})
				.then(async (webhook) => {
					await DB.findOneAndUpdate(
						{
							id: guildId,
						},
						{
							$set: {
								'logs.webhook.id': webhook.id,
								'logs.webhook.token': webhook.token,
							},
						},
					);
				});
		}

		return interaction.editReply({
			embeds: [
				embed.setDescription(
					`🔹 | Got it, logs will now be sent to: <#${channel.id}>.`,
				),
			],
		});
	},
};

export default subCommand;
