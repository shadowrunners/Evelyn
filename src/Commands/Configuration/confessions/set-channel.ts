import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	TextChannel,
} from 'discord.js';
import { GuildDB as DB } from '../../../structures/schemas/guild.js';
import { Subcommand } from '../../../Interfaces/interfaces.js';
import { Evelyn } from '../../../structures/Evelyn.js';

const subCommand: Subcommand = {
	subCommand: 'confessions.set-channel',
	async execute(interaction: ChatInputCommandInteraction, client: Evelyn) {
		const { options, guildId } = interaction;
		const channel = options.getChannel('channel') as TextChannel;
		const embed = new EmbedBuilder().setColor('Blurple');
		const data = await DB.findOne({ id: guildId });

		if (data.confessions?.channel) {
			const fetchWebhook = await client.fetchWebhook(
				data.confessions?.webhook?.id,
				data.confessions?.webhook?.token,
			);
			await fetchWebhook.delete();

			channel
				.createWebhook({
					name: `${client.user.username} · Confessions`,
					avatar: client.user.avatarURL(),
				})
				.then(async (webhook) => {
					await DB.findOneAndUpdate(
						{
							id: guildId,
						},
						{
							$set: {
								'confessions.channel': channel.id,
								'confessions.webhook.id': webhook.id,
								'confessions.webhook.token': webhook.token,
							},
						},
					);
				});
		}
		else
			channel
				.createWebhook({
					name: `${client.user.username} · Confessions`,
					avatar: client.user.avatarURL(),
				})
				.then(async (webhook) => {
					await DB.findOneAndUpdate(
						{
							id: guildId,
						},
						{
							$set: {
								'confessions.channel': channel.id,
								'confessions.webhook.id': webhook.id,
								'confessions.webhook.token': webhook.token,
							},
						},
					);
				});

		return interaction.reply({
			embeds: [
				embed.setDescription(
					`🔹 | Got it, confessions will now be sent to: <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	},
};

export default subCommand;
