const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const { ManageChannels, SendMessages } = PermissionsBitField.Flags;
const DB = require("../../structures/schemas/lockdown.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock a channel.")
    .setDefaultMemberPermissions(ManageChannels)
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("How long would you like the quarantine to last?")
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Provide a reason for the quarantine.")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    const { guild, channel, options } = interaction;
    const reason = options.getString("reason") || "Unknown";
    const time = options.getString("time");
    const Embed = new EmbedBuilder();

    if (!channel.permissionsFor(guild.id).has(SendMessages))
      return interaction.reply({
        embeds: [
          Embed.setDescription("🔹 | This channel is already locked.")
            .setColor("Blurple")
            .setTimestamp(),
        ],
      });

    channel.permissionOverwrites.edit(guild.id, {
      SendMessages: false,
    });

    interaction.reply({
      embeds: [
        Embed.setDescription(`🔹 | This channel is now locked for: ${reason}`)
          .setColor("Blurple")
          .setTimestamp(),
      ],
    });

    if (time) {
      DB.create({
        guildId: guild.id,
        channelId: channel.id,
        timeLocked: Date.now() + ms(time),
      });

      setTimeout(async () => {
        channel.permissionOverwrites.edit(guild.id, {
          SendMessages: null,
        });
        interaction.editReply({
          embeds: [
            Embed.setDescription(
              "🔹 | This channel has been unlocked."
            ).setColor("Blurple"),
          ],
        });
        await DB.deleteOne({ channelId: channel.id }).catch(_err);
      }, ms(time));
    }
  },
};
