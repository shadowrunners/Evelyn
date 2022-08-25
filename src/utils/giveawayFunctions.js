const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const DB = require("../structures/schemas/giveaway.js");

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return [...new Set(shuffled.slice(0, num))];
}

async function endGiveaway(message, reroll = false) {
  const data = await DB.findOne({
    ID: message.guild.id,
    MessageID: message.id,
  });
  if (!data) return;

  if (data.Ended === true && !reroll) return;
  if (data.Paused === true) return;

  let winnerIdArray = [];
  if (data.Entered.length > data.Winners) {
    winnerIdArray.push(...getMultipleRandom(data.Entered, data.Winners));
    while (winnerIdArray.length < data.Winners)
      winnerIdArray.push(
        getMultipleRandom(data.Entered, data.Winners - winnerIdArray.length)
      );
  } else winnerIdArray.push(...data.Entered);

  const disableButton = ActionRowBuilder.from(
    message.components[0]
  ).setComponents(
    ButtonBuilder.from(message.components[0].components[0]).setDisabled(true)
  );

  const endGiveawayEmbed = EmbedBuilder.from(message.embeds[0])
    .setColor("Blurple")
    .setDescription(
      `**Hosted By**: <@${data.HostedBy}>\n**Winners**: ${
        winnerIdArray.map((user) => `<@${user}>`).join(", ") || "None"
      } \n**Ended**: <t:${data.EndTime}:R> (<t:${data.EndTime}>)`
    );

  await DB.findOneAndUpdate(
    {
      GuildID: data.GuildID,
      ChannelID: data.ChannelID,
      MessageID: message.id,
    },
    { Ended: true }
  );

  await message.edit({
    content: "🎊 **This giveaway has ended, thank you for participating!** 🎊",
    embeds: [endGiveawayEmbed],
    components: [disableButton],
  });
  message.reply({
    content:
      winnerIdArray.length > 0
        ? `🥳 Congratulations, ${winnerIdArray
            .map((user) => `<@${user}>`)
            .join(", ")}! You have won **${data.Prize}**! 🥳`
        : "No winner was decided because no one entered the giveaway. 😞",
  });
}

module.exports = { endGiveaway };
