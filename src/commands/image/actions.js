const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const importedWaifu = require("../../functions/waifuEngine.js");
const WaifuEngine = new importedWaifu();

module.exports = {
  botPermissions: ["SendMessages", "EmbedLinks"],
  data: new SlashCommandBuilder()
    .setName("actions")
    .setDescription("Express your emotions to someone with actions!")
    .addStringOption((options) =>
      options
        .setName("action")
        .setDescription("Select an action.")
        .addChoices(
          { name: "🔹 | Bite", value: "bite" },
          { name: "🔹 | Blush", value: "blush" },
          { name: "🔹 | Bonk", value: "bonk" },
          { name: "🔹 | Bully", value: "bully" },
          { name: "🔹 | Cringe", value: "cringe" },
          { name: "🔹 | Cry", value: "cry" },
          { name: "🔹 | Cuddle", value: "cuddle" },
          { name: "🔹 | Handhold", value: "handhold" },
          { name: "🔹 | Highfive", value: "highfive" },
          { name: "🔹 | Hug", value: "hug" },
          { name: "🔹 | Kiss", value: "kiss" },
          { name: "🔹 | Pat", value: "pat" },
          { name: "🔹 | Poke", value: "poke" },
          { name: "🔹 | Wave", value: "wave" }
        )
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Provide a target.")
        .setRequired(false)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;
    const target = options.getUser("target");

    await interaction.deferReply();

    switch (options.getString("action")) {
      case "bite":
        return WaifuEngine.bite(target, interaction);

      case "blush":
        return WaifuEngine.blush(interaction, target);

      case "bonk":
        return WaifuEngine.bonk(interaction, target);

      case "bully":
        return WaifuEngine.bully(interaction, target);

      case "cringe":
        return WaifuEngine.cringe(interaction);

      case "cry":
        return WaifuEngine.cry(interaction);

      case "cuddle":
        return WaifuEngine.cuddle(interaction, target);

      case "handhold":
        return WaifuEngine.bite(interaction, target);

      case "highfive":
        return WaifuEngine.highfive(interaction, target);

      case "hug":
        return WaifuEngine.hug(interaction, target);

      case "kiss":
        return WaifuEngine.kiss(interaction, target);

      case "pat":
        return WaifuEngine.pat(interaction, target);

      case "poke":
        return WaifuEngine.poke(interaction, target);

      case "slap":
        return WaifuEngine.slap(interaction, target);

      case "wave":
        return WaifuEngine.wave(interaction, target);
    }
  },
};
