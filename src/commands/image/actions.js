const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const WAPI = require("../../modules/waifuImages.js");

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
  execute(interaction) {
    const { options } = interaction;
    const target = options.getUser("target");

    switch (options.getString("action")) {
      case "bite":
        return WAPI.bite(interaction, target);

      case "blush":
        return WAPI.blush(interaction, target);

      case "bonk":
        return WAPI.bonk(interaction, target);

      case "bully":
        return WAPI.bully(interaction, target);

      case "cringe":
        return WAPI.cringe(interaction);

      case "cry":
        return WAPI.cry(interaction);

      case "cuddle":
        return WAPI.cuddle(interaction, target);

      case "handhold":
        return WAPI.bite(interaction, target);

      case "highfive":
        return WAPI.highfive(interaction, target);

      case "hug":
        return WAPI.hug(interaction, target);

      case "kiss":
        return WAPI.kiss(interaction, target);

      case "pat":
        return WAPI.pat(interaction, target);

      case "poke":
        return WAPI.poke(interaction, target);

      case "slap":
        return WAPI.slap(interaction, target);

      case "wave":
        return WAPI.wave(interaction, target);
    }
  },
};
