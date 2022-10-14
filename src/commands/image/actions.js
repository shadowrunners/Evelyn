const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const { waifuImages } = require("../../modules/waifuImages");

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

    try {
      switch (options.getSubcommand()) {
        case "bite":
          target = options.getUser("target");
          return waifuImages("bite", target, interaction);

        case "blush":
          target = options.getUser("target");
          return waifuImages("blush", target, interaction);

        case "bonk":
          target = options.getUser("target");
          return waifuImages("bonk", target, interaction);

        case "bully":
          target = options.getUser("target");
          return waifuImages("bully", target, interaction);

        case "cringe":
          return waifuImages("cringe", target, interaction);

        case "cry":
          return waifuImages("cry", target, interaction);

        case "cuddle":
          target = options.getUser("target");
          return waifuImages("cuddle", target, interaction);

        case "handhold":
          target = options.getUser("target");
          return waifuImages("handhold", target, interaction);

        case "highfive":
          target = options.getUser("target");
          return waifuImages("highfive", target, interaction);

        case "hug":
          target = options.getUser("target");
          return waifuImages("hug", target, interaction);

        case "kiss":
          target = options.getUser("target");
          return waifuImages("kiss", target, interaction);

        case "pat":
          target = options.getUser("target");
          return waifuImages("pat", target, interaction);

        case "poke":
          target = options.getUser("target");
          return waifuImages("poke", target, interaction);

        case "slap":
          target = options.getUser("target");
          return waifuImages("slap", target, interaction);

        case "wave":
          target = options.getUser("target");
          return waifuImages("wave", target, interaction);
      }
    } catch (e) {
      console.log(e);
    }
  },
};
