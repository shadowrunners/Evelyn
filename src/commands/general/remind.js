const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const { reminded } = require("../../functions/reminderUtils.js");
const DB = require("../../structures/schemas/reminders.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Sets a reminder for you.")
    .addStringOption((options) =>
      options
        .setName("message")
        .setDescription("What should I remind you of?")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("time")
        .setDescription("When should I remind you?")
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    const { options } = interaction;
    const remindMessage = options.getString("message");
    const time = ms(options.getString("time"));

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    if (isNaN(time))
      return interaction.reply({
        embeds: [
          embed.setDescription("🔹 | An invalid time has been provided."),
        ],
      });

    interaction
      .reply({
        embeds: [
          embed
            .setTitle("Reminder set!")
            .setDescription(
              `Okay, I'll remind you to \`${remindMessage}\` <t:${parseInt(
                (Date.now() + time) / 1000
              )}:R>.`
            ),
        ],
        fetchReply: true,
      })
      .then(async (message) => {
        await DB.create({
          guildId: interaction.guild.id,
          channelId: interaction.channel.id,
          messageId: message.id,
          userId: interaction.user.id,
          scheduledTime: parseInt((Date.now() + time) / 1000),
          reminder: remindMessage,
          hasBeenReminded: false,
        }).then((data) => {
          setTimeout(async () => {
            if (!data.hasBeenReminded) await reminded(message);
          }, time);
        });
      });
  },
};
