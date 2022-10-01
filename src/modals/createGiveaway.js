const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ModalSubmitInteraction,
  PermissionsBitField,
  ButtonStyle,
} = require("discord.js");
const DB = require("../structures/schemas/giveaway.js");
const { ManageGuild } = PermissionsBitField.Flags;
const ms = require("ms");

module.exports = {
  id: "createGiveaway",
  permission: ManageGuild,
  /**
   * @param {ModalSubmitInteraction} interaction
   */
  async execute(interaction) {
    const prize = interaction.fields
      .getTextInputValue("giveaway-prize")
      .slice(0, 256);

    const winners = Math.round(
      parseFloat(interaction.fields.getTextInputValue("giveaway-winners"))
    );

    const duration = ms(
      interaction.fields.getTextInputValue("giveaway-duration")
    );

    const formattedDuration = parseInt((Date.now() + duration) / 1000);

    if (isNaN(winners) || !isFinite(winners) || winners < 1) {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | Please provide a valid winner count.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (duration === undefined) {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | Please provide a valid duration.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const giveawayEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(prize)
      .setDescription(
        `**Hosted by**: ${interaction.member}\n**Winners**: ${winners}\n**Ends**: <t:${formattedDuration}:R> (<t:${formattedDuration}>)`
      )
      .setTimestamp(parseInt(Date.now() + duration));

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("joinGiveaway")
        .setEmoji("🎉")
        .setStyle(ButtonStyle.Success)
        .setLabel("Join")
    );

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
          setTimeout(async () => {
            if (!data.hasEnded) endGiveaway(message);
          }, duration);
        });
      });
  },
};
