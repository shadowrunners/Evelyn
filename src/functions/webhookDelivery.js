/** This function delivers the logs using Discord Webhooks. It exists as a separate dedicated function to avoid repeating code. */

const { WebhookClient } = require("discord.js");

function webhookDelivery(data, embed) {
  const dropOffClient = new WebhookClient({
    id: data.logs.webhook.id,
    token: data.logs.webhook.token,
  });

  return dropOffClient.send({
    embeds: [embed],
  });
}

module.exports = { webhookDelivery };
