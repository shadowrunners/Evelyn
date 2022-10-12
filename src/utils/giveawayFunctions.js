const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const DB = require("../structures/schemas/giveaway.js");

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return [...new Set(shuffled.slice(0, num))];
}

async function endGiveaway(message, reroll = false) {
  if (!message.guild) return;
  await message.client.guilds.fetch();
  if (!message.client.guilds.cache.get(message.guild.id)) return;

  const data = await DB.findOne({
    id: message.guild.id,
    messageID: message.id,
  });

  if (!data) return;
  if (
    !message.guild.channels.cache
      .get(data.channel)
      ?.messages.fetch(data.messageID)
  )
    return;

  if (data.hasEnded === true && !reroll) return;
  if (data.isPaused === true) return;

  const winnerIdArray = [];
  if (data.enteredUsers.length > data.winners) {
    winnerIdArray.push(...getMultipleRandom(data.enteredUsers, data.winners));
    while (winnerIdArray.length < data.winners)
      winnerIdArray.push(
        getMultipleRandom(
          data.enteredUsers,
          data.winners - winnerIdArray.length
        )
      );
  } else winnerIdArray.push(...data.enteredUsers);

  const disableButton = ActionRowBuilder.from(
    message.components[0]
  ).setComponents(
    ButtonBuilder.from(message.components[0].components[0]).setDisabled(true)
  );

  const endGiveawayEmbed = EmbedBuilder.from(message.embeds[0])
    .setColor("Blurple")
    .setDescription(
      `**Hosted by**: <@${data.hoster}>\n**Winners**: ${
        winnerIdArray.map((user) => `<@${user}>`).join(", ") || "None"
      }\n**Ends in**: <t:${data.endTime}:R> (<t:${data.endTime}>)`
    );

  await DB.findOneAndUpdate(
    {
      id: data.id,
      channel: data.channel,
      messageID: message.id,
    },
    { Ended: true }
  );

  await message.edit({
    content: "🎊 **Giveaway Ended** 🎊",
    embeds: [endGiveawayEmbed],
    components: [disableButton],
  });
  message.reply({
    content: winnerIdArray.length
      ? `🥳 Congratulations ${winnerIdArray
          .map((user) => `<@${user}>`)
          .join(", ")}! You won **${data.prize}**! 🥳`
      : "No winner was decided because no one entered the giveaway. ☹️",
  });
}

module.exports = { endGiveaway };
