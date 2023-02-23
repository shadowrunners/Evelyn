const { WebhookClient, EmbedBuilder, codeBlock } = require('discord.js');
const { inspect } = require('util');

/**
 * This function manages Evelyn's Crash Report function which will send any errors to your Overwatch channel.
 * @param {Client} client - The client object from Discord.js.
 * @param {Error} err - The error parameter which will contain the full error including stack traces.
 */

function crashReporter(client, err) {
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
