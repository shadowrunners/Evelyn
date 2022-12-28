/** This function manages Evelyn's Crash Report function which will send any errors to your Overwatch channel. */
const { WebhookClient, EmbedBuilder, codeBlock } = require("discord.js");

function crashReporter(client, err) {
  if (!client.config.debug.watcherHook) return;

  const crashReportClient = new WebhookClient({
    url: client.config.debug.watcherHook,
  });

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle(`Crash Report`)
    .setDescription(
      `\n${codeBlock(`- CRASH DUMP START -\n\n${err}\n\n- CRASH DUMP END -`)} `
    )
    .setTimestamp();

  return crashReportClient.send({
    embeds: [embed],
    content: `<@${client.config.ownerIDs}>`,
  });
}

module.exports = { crashReporter };
