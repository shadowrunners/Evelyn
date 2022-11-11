const {
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ModalSubmitInteraction,
  PermissionsBitField,
  ButtonStyle,
} = require("discord.js");
const { endGiveaway } = require("../utils/giveawayFunctions.js");
const DB = require("../structures/schemas/giveaway.js");
const { ManageGuild } = PermissionsBitField.Flags;
const ms = require("ms");

module.exports = {
  id: "createGiveaway",
  permission: ManageGuild,
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
<<<<<<< Updated upstream
  execute(interaction) {
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    const prize = interaction.fields
      .getTextInputValue("giveaway-prize")
      .slice(0, 256);
=======
  execute(interaction, client) {
    const { fields } = interaction;
    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    const prize = fields.getTextInputValue("giveaway-prize").slice(0, 256);
>>>>>>> Stashed changes

    const winners = Math.round(
      parseFloat(fields.getTextInputValue("giveaway-winners"))
    );

    const duration = fields.getTextInputValue("giveaway-duration");

    if (isNaN(winners) || !isFinite(winners) || winners < 1) {
      embed.setDescription("🔹 | Please provide a valid winner count.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (duration === undefined) {
      embed.setDescription("🔹 | Please provide a valid duration.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    //  giveaways.create(client, {
    //   prize: prize,
    //    host: interaction.user.id,
    ///   winners: winners,
    //   endAfter: duration,
    //    channelID: interaction.channel.id,
    //   });

    return interaction.reply({ content: "Giveaway created.", ephemeral: true });

    // const giveawayEmbed = new EmbedBuilder()
    //   .setColor("Blurple")
    //    .setTitle(prize)
    ///    .setDescription(
    //      `**Hosted by**: ${interaction.member}\n**Winners**: ${winners}\n**Ends**: <t:${formattedDuration}:R> (<t:${formattedDuration}>)`
    //    )
    //   .setTimestamp(parseInt(Date.now() + duration));
    //
    //  const button = new ActionRowBuilder().addComponents(
    //    new ButtonBuilder()
    //      .setCustomId("joinGiveaway")
    //      .setEmoji("🎉")
    //      .setStyle(ButtonStyle.Success)
    //      .setLabel("Join")
    //  );

<<<<<<< Updated upstream
    interaction
      .reply({
        content: "🎉 **A wild giveaway has appeared!** 🎉",
        embeds: [giveawayEmbed],
        components: [button],
        fetchReply: true,
      })
      .then(async (message) => {
        await DB.create({
          id: interaction.guild.id,
          channel: interaction.channel.id,
          endTime: formattedDuration,
          hasEnded: false,
          hoster: interaction.user.id,
          prize: prize,
          winners: winners,
          isPaused: false,
          messageID: message.id,
          enteredUsers: [],
        }).then((data) => {
          setTimeout(() => {
            if (!data.hasEnded) endGiveaway(message);
          }, duration);
        });
      });
=======
    // interaction
    //     .reply({
    //     content: "🎉 **A wild giveaway has appeared!** 🎉",
    //     embeds: [giveawayEmbed],
    //     components: [button],
    //     fetchReply: true,
    //    })
    //    .then(async (message) => {
    //     await DB.create({
    //       id: interaction.guild.id,
    //        channel: interaction.channel.id,
    //       endTime: formattedDuration,
    //       hasEnded: false,
    //      hoster: interaction.user.id,
    //       prize: prize,
    //      winners: winners,
    //       isPaused: false,
    //       messageID: message.id,
    //       enteredUsers: [],
    //      }).then((data) => {
    //       setTimeout(() => {
    //         if (!data.hasEnded) endGiveaway(message);
    //       }, duration);
    //     });
    //   });
>>>>>>> Stashed changes
  },
};
