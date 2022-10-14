const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { Rank } = require("canvacord");
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
    const target = interaction.options.getUser("target") || interaction.member;
    await target.user.fetch();

    const embed = new EmbedBuilder();
    const user = await DXP.fetch(target.id, interaction.guild.id, true);

    if (!user)
      return interaction.reply({
        embeds: [
          embed
            .setColor("Blurple")
            .setDescription("🔹 | This user hasn't gained any XP yet.")
            .setTimestamp(),
        ],
        ephemeral: true,
      });

    const requiredlvl = DXP.xpFor(parseInt(user.level) + 1);

    const buildRankCard = new Rank()
      .setAvatar(target.displayAvatarURL({ forceStatic: true }))
      .setBackground(
        "IMAGE",
        "https://cdn.discordapp.com/attachments/925125325107658832/1025831914818510908/rankcard.png"
      )
      .setCurrentXP(user.xp)
      .setLevel(user.level, "Level")
      .setRank(user.position)
      .setRequiredXP(requiredlvl)
      .setProgressBar("#FFFFFF", "COLOR")
      .setUsername(target.user.username)
      .setDiscriminator(target.user.discriminator);

    const rankCard = await buildRankCard
      .build()
      .catch((_err) => console.log(_err));
    const attachment = new AttachmentBuilder(rankCard, { name: "card.png" });

    return interaction.reply({
      files: [attachment],
    });
  },
};
