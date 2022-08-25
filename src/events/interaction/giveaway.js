const {
  EmbedBuilder,
  ModalSubmitInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");
const DB = require("../../structures/schemas/giveaway.js");
const { endGiveaway } = require("../../utils/giveawayFunctions.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ModalSubmitInteraction} interaction
   */
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== "giveaway-options") return;

    const embed = new EmbedBuilder();

    const prize = interaction.fields
      .getTextInputValue("giveaway-prize")
      .slice(0, 256);
    const winners = Math.round(
      parseFloat(interaction.fields.getTextInputValue("giveaway-winners"))
    );
    const duration = ms(
      interaction.fields.getTextInputValue("giveaway-duration")
    );

    if (isNaN(winners) || !isFinite(winners) || winners < 1) {
      embed
        .setColor("Blurple")
        .setDescription(
          "🔹 | Invalid winner count, please provide a valid winner count."
        )
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (duration === undefined) {
      embed
        .setColor("Blurple")
        .setDescription(
          "🔹 | Invalid duration, please provide a valid duration."
        )
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const formattedDuration = parseInt((Date.now() + duration) / 1000);

    const giveawayEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(prize)
      .setDescription(
        `**Hosted by**: ${interaction.member}\n**Winners**: ${winners}\n**Ends in**: <t:${formattedDuration}:R> (<t:${formattedDuration}>)`
      )
      .setTimestamp(parseInt(Date.now() + duration));

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("giveaway-join")
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
          ID: interaction.guild.id,
          ChannelID: interaction.channel.id,
          EndTime: formattedDuration,
          Ended: false,
          HostedBy: interaction.user.id,
          Prize: prize,
          Winners: winners,
          Paused: false,
          MessageID: message.id,
          Entered: [],
        }).then((data) => {
          setTimeout(async () => {
            if (!data.Ended) endGiveaway(message);
          }, duration);
        });
      });
  },
};
