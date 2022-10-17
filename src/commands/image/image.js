const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const {
  checkAvatar,
  checkUsername,
  checkText,
} = require("../../modules/nekoHelper.js");
const API = require("../../modules/nekoModule.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("Generate various images.")
    .addStringOption((options) =>
      options
        .setName("type")
        .setDescription("Select the type of filter you would like to use.")
        .setRequired(true)
        .addChoices(
          { name: "🔹 | Awooify", value: "awooify" },
          { name: "🔹 | Baguette", value: "baguette" },
          { name: "🔹 | Blurpify", value: "blurpify" },
          { name: "🔹 | Captcha", value: "captcha" },
          { name: "🔹 | Change My Mind", value: "changemymind" },
          { name: "🔹 | Deepfry", value: "deepfry" },
          { name: "🔹 | Kanna", value: "kannagen" },
          { name: "🔹 | PH Comment", value: "phcomment" },
          { name: "🔹 | Ship", value: "ship" },
          { name: "🔹 | Threats", value: "threats" },
          { name: "🔹 | Trash", value: "trash" },
          { name: "🔹 | Trump Tweet", value: "trumptweet" },
          { name: "🔹 | Tweet", value: "tweet" },
          { name: "🔹 | Who would win?", value: "whowouldwin" }
        )
    )
    .addUserOption((option) =>
      option
        .setName("user1")
        .setDescription("Provide a target.")
        .setRequired(false)
    )
    .addUserOption((option) =>
      option
        .setName("user2")
        .setDescription("Provide a target.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Provide the text that will be shown in the image.")
        .setRequired(false)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;
    const choices = options.getString("type");

    const user1 = options.getUser("user1");
    const user2 = options.getUser("user2");
    const text = options.getString("text");

    const embed = new EmbedBuilder().setColor("Blurple").setTimestamp();

    let image;

    await interaction.deferReply();

    switch (choices) {
      case "awooify":
        if (checkAvatar(user1, user2, interaction)) return;
        image = await API.awooify(user1, user2);
        return interaction.editReply({ embeds: [embed.setImage(image)] });

      case "baguette":
        if (checkAvatar(user1, user2, interaction)) return;
        image = await API.baguette(user1, user2);
        return interaction.editReply({ embeds: [embed.setImage(image)] });

      case "blurpify":
        if (checkAvatar(user1, user2, interaction)) return;
        image = await API.blurpify(user1, user2);
        return interaction.editReply({ embeds: [embed.setImage(image)] });

      case "captcha":
        if (
          checkAvatar(user1, user2, interaction) ||
          checkUsername(user1, user2, interaction)
        )
          return;
        image = await API.captcha(user1, user2);
        return interaction.editReply({ embeds: [embed.setImage(image)] });

      case "changemymind":
        if (checkText(text, interaction)) return;
        image = await API.changemymind(text);

        return interaction.editReply({ embeds: [embed.setImage(image)] });

      case "deepfry":
        if (checkAvatar(user1, user2, interaction)) return;
        image = await API.deepfry(user1, user2);

        return interaction.editReply({ embeds: [embed.setImage(image)] });

      case "kannagen":
        if (checkText(text, interaction)) return;
        image = await API.kannagen(text);

        return interaction.editReply({ embeds: [embed.setImage(image)] });

      case "phcomment":
        if (
          checkAvatar(user1, user2, interaction) ||
          checkUsername(user1, user2, interaction) ||
          checkText(text, interaction)
        )
          return;
        image = await API.phcomment(user1, user2, text);

        return interaction.editReply({ embeds: [embed.setImage(image)] });

      case "ship":
        if (checkAvatar(user1, user2, interaction)) return;
        image = await API.ship(user1, user2);

        return interaction.editReply({ embeds: [embed.setImage(image)] });

      case "threats":
        if (checkAvatar(user1, user2, interaction)) return;
        image = await API.threats(user1, user2);

        return interaction.editReply({ embeds: [embed.setImage(image)] });

      case "trash":
        if (checkAvatar(user1, user2, interaction)) return;
        image = await API.trash(user1, user2);

        return interaction.editReply({ embeds: [embed.setImage(image)] });

      case "trumptweet":
        if (checkText(text, interaction)) return;
        image = await API.trumptweet(text);
        return interaction.editReply({ embeds: [embed.setImage(image)] });

      case "tweet":
        if (
          checkUsername(user1, user2, interaction) ||
          checkText(text, interaction)
        )
          return;
        image = await API.tweet(user1, user2, text);
        return interaction.editReply({ embeds: [embed.setImage(image)] });

      case "whowouldwin":
        if (checkAvatar(user1, user2, interaction)) return;
        image = await API.whowouldwin(user1, user2);
        return interaction.editReply({ embeds: [embed.setImage(image)] });
    }
  },
};
