const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const WAPI = require("../../modules/waifuImages");

module.exports = {
  botPermissions: ["SendMessages", "EmbedLinks"],
  data: new SlashCommandBuilder()
    .setName("actions")
    .setDescription("Express your emotions to someone with actions!")
    .addSubcommand((options) =>
      options
        .setName("bite")
        .setDescription("Feeling angry? Might as well bite someone.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Provide a target.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("blush")
        .setDescription(
          "Someone said something very flirty to you? Might as well blush a bit too."
        )
    )
    .addSubcommand((options) =>
      options
        .setName("bonk")
        .setDescription(
          "Saw a message that was a little too NSFW? Bonk that person and send them to jail."
        )
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Provide a target.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("bully")
        .setDescription("You're feeling a little mean today? Bully someone.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Provide a target.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("cringe")
        .setDescription(
          "Saw something that was a little too cringe? Might as well express it with this option."
        )
    )
    .addSubcommand((options) =>
      options
        .setName("cry")
        .setDescription("Feeling sad? Maybe crying will help.")
    )
    .addSubcommand((options) =>
      options
        .setName("cuddle")
        .setDescription(
          "You ever wanted to cuddle with your friend? Might as well use this option now."
        )
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Provide a target.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("handhold")
        .setDescription(
          "You like someone? Might as well hold their hand to express your feelings to them."
        )
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Provide a target.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("highfive")
        .setDescription(
          "Highfive someone, might be useful if you and your friend rediscover electricity."
        )
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Provide a target.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("hug")
        .setDescription(
          "Someone is feeling sad? Give them a hug and see if it improves their mood."
        )
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Provide a target.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("kiss")
        .setDescription("I─ Yeah. You know what this does.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Provide a target.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("pat")
        .setDescription(
          "Saw too much anime and always want to pat people now? Here you go."
        )
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Provide a target.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("poke")
        .setDescription("You ever wanted to annoy someone? Poke them.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Provide a target.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("slap")
        .setDescription(
          "Someone got you feeling angry? Might as well slap them."
        )
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Provide a target.")
            .setRequired(true)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("wave")
        .setDescription(
          "A new person joined your server? Might as well give them a friendly lil wave."
        )
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Provide a target.")
            .setRequired(true)
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    const { options } = interaction;
    let target;

    if (target.id === interaction.user.id)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription("🔹 | You can't use this command on yourself.")
            .setTimestamp(),
        ],
        ephemeral: true,
      });

    switch (options.getSubcommand()) {
      case "bite":
        target = options.getUser("target");
        return WAPI.bite(interaction, target);

      case "blush":
        target = options.getUser("target");
        return WAPI.blush(interaction, target);

      case "bonk":
        target = options.getUser("target");
        return WAPI.bonk(interaction, target);

      case "bully":
        target = options.getUser("target");
        return WAPI.bully(interaction, target);

      case "cringe":
        return WAPI.cringe(interaction);

      case "cry":
        return WAPI.cry(interaction);

      case "cuddle":
        target = options.getUser("target");
        return WAPI.cuddle(interaction, target);

      case "handhold":
        target = options.getUser("target");
        return WAPI.bite(interaction, target);

      case "highfive":
        target = options.getUser("target");
        return WAPI.highfive(interaction, target);

      case "hug":
        target = options.getUser("target");
        return WAPI.hug(interaction, target);

      case "kiss":
        target = options.getUser("target");
        return WAPI.kiss(interaction, target);

      case "pat":
        target = options.getUser("target");
        return WAPI.pat(interaction, target);

      case "poke":
        target = options.getUser("target");
        return WAPI.poke(interaction, target);

      case "slap":
        target = options.getUser("target");
        return WAPI.slap(interaction, target);

      case "wave":
        target = options.getUser("target");
        return WAPI.wave(interaction, target);
    }
  },
};
