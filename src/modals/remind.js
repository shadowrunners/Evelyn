const { EmbedBuilder, ModalSubmitInteraction } = require("discord.js");
const ms = require("ms");

module.exports = {
  id: "remind",
  /**
   * @param {ModalSubmitInteraction} interaction
   */
  execute(interaction) {
    const whyRemind = interaction.fields.getTextInputValue("whyRemind");
    const remindMeIn = interaction.fields.getTextInputValue("remindMeIn");

    const embed = new EmbedBuilder();

    const date = new Date(new Date().getTime() + ms(remindMeIn));

    if (!whyRemind) {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | Please provide a valid reminder.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (remindMeIn === undefined) {
      embed
        .setColor("Blurple")
        .setDescription("🔹 | Please provide a valid duration.")
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const remindMe = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Reminder set!")
      .setDescription(
        `Okay, I'll remind you to \`${whyRemind}\` on ${date.toLocaleString()}.`
      )
      .setTimestamp();

    const reminded = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Reminder")
      .setDescription(
        `Hiya! Your reminder for \`${whyRemind}\` has triggered on ${date.toLocaleString()}.`
      )
      .setTimestamp();

    interaction.reply({ embeds: [remindMe], ephemeral: true }).then(() => {
      setTimeout(() => {
        interaction.user?.send({ embeds: [reminded] });
      }, ms(remindMeIn));
    });
  },
};
