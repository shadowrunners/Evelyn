import { WebhookClient, EmbedBuilder, codeBlock } from 'discord.js';
import { Evelyn } from '../../Evelyn.js';
import { inspect } from 'util';

/** This function manages Evelyn's Crash Report function which will send any errors to your Overwatch channel. */
export function crashReporter(client: Evelyn, err: Error) {
	if (!client.config.debug.watcherHook) return;

	const crashReportClient = new WebhookClient({
		url: client.config.debug.watcherHook,
	});

	const embed = new EmbedBuilder()
		.setColor('Red')
		.setTitle('Crash Report')
		.setDescription(
			`\n${codeBlock(
				`- CRASH DUMP START -\n\n${inspect(err, {
					depth: 0,
				})}\n\n- CRASH DUMP END -`,
			)} `,
		)
		.setTimestamp();

	return crashReportClient.send({
		embeds: [embed],
		content: `<@${client.config.ownerIDs}>`,
	});
}

module.exports = { crashReporter };
