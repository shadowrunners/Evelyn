const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const importedWaifu = require("../../functions/waifuAPI.js");

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
    const WaifuEngine = new importedWaifu(interaction);
    const target = options.getUser("target");

    await interaction.deferReply();

    switch (options.getString("action")) {
      case "bite":
        return WaifuEngine.bite(target);

      case "blush":
        return WaifuEngine.blush();

      case "bonk":
        return WaifuEngine.bonk(target);

      case "bully":
        return WaifuEngine.bully(target);

      case "cringe":
        return WaifuEngine.cringe();

      case "cry":
        return WaifuEngine.cry();

      case "cuddle":
        return WaifuEngine.cuddle(target);

      case "handhold":
        return WaifuEngine.handhold(target);

      case "highfive":
        return WaifuEngine.highfive(target);

      case "hug":
        return WaifuEngine.hug(target);

      case "kiss":
        return WaifuEngine.kiss(target);

      case "pat":
        return WaifuEngine.pat(target);

      case "poke":
        return WaifuEngine.poke(target);

      case "slap":
        return WaifuEngine.slap(target);

      case "wave":
        return WaifuEngine.wave(target);
    }
  },
};
