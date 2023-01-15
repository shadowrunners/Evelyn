const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { profileImage } = require("discord-arts");
const DXP = require("discord-xp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Displays the rank of a user.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Provide a user.")
        .setRequired(false)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, member, guildId } = interaction;
    const target = options.getUser("target") || member;
    const user = await DXP.fetch(target.id, guildId, true);

    await interaction.deferReply();

    if (!user)
      return interaction.editReply({
        content: "🔹 | This user hasn't gained any XP yet.",
        ephemeral: true,
      });

    const requiredlvl = DXP.xpFor(parseInt(user.level) + 1);
    const rankCard = await profileImage(target.id, {
      rankData: {
        currentXp: user.xp,
        requiredXp: requiredlvl,
        rank: user.position,
        level: user.level,
        barColor: "5865F2"
      }
    })
    const attachment = new AttachmentBuilder(rankCard, { name: "card.png" });

    return interaction.editReply({
      files: [attachment],
    });
  },
};
