const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const { NekoBot } = require("nekobot-api");
const imageGen = new NekoBot();

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
          { name: "🔹 | Fact", value: "fact" },
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

    const username = user1?.username || user2?.username;
    const avatar = user1?.avatarURL() || user2?.avatarURL();

    const embed = new EmbedBuilder().setTimestamp();

    interaction.deferReply();

    switch (choices) {
      case "awooify": {
        if (!avatar)
          return interaction.reply({
            embeds: [
              embed.setDescription("🔹 | You forgot to mention a user."),
            ],
          });

        const image = await imageGen.generate("awooify", { url: avatar });

        embed.setImage(image);
        return interaction.editReply({ embeds: [embed] });
      }
      case "baguette": {
        if (!avatar)
          return interaction.reply({
            embeds: [
              embed.setDescription("🔹 | You forgot to mention a user."),
            ],
          });

        const image = await imageGen.generate("baguette", { url: avatar });

        embed.setImage(image);
        return interaction.editReply({ embeds: [embed] });
      }
      case "blurpify": {
        if (!avatar)
          return interaction.reply({
            embeds: [
              embed.setDescription("🔹 | You forgot to mention a user."),
            ],
          });

        const image = await imageGen.generate("blurpify", { image: avatar });

        embed.setImage(image);
        return interaction.editReply({
          embeds: [embed],
        });
      }
      case "captcha": {
        if (!avatar || !username)
          return interaction.reply({
            embeds: [
              embed.setDescription("🔹 | You forgot to mention a user."),
            ],
          });

        const image = await imageGen.generate("captcha", {
          url: avatar,
          username: username,
        });

        embed.setImage(image);
        return interaction.editReply({ embeds: [embed] });
      }
      case "changemymind": {
        if (!text)
          return interaction.reply({
            embeds: [
              embed.setDescription("🔹 | You forgot to provide some text."),
            ],
          });

        const image = await imageGen.generate("changemymind", { text: text });

        embed.setImage(image);
        return interaction.editReply({ embeds: [embed] });
      }
      case "deepfry": {
        if (!avatar)
          return interaction.reply({
            embeds: [
              embed.setDescription("🔹 | You forgot to mention a user."),
            ],
          });

        const image = await imageGen.generate("deepfry", { image: avatar });

        embed.setImage(image);
        return interaction.editReply({ embeds: [embed] });
      }
      case "fact": {
        if (!text)
          return interaction.reply({
            embeds: [
              embed.setDescription("🔹 | You forgot to provide some text."),
            ],
          });

        const image = await imageGen.generate("fact", { text: text });

        embed.setImage(image);
        return interaction.editReply({ embeds: [embed] });
      }
      case "kannagen": {
        if (!text)
          return interaction.reply({
            embeds: [
              embed.setDescription("🔹 | You forgot to provide some text."),
            ],
          });

        const image = await imageGen.generate("kannagen", { text: text });

        embed.setImage(image);
        return interaction.editReply({ embeds: [embed] });
      }
      case "phcomment": {
        if (!avatar || !text || !username)
          return interaction.reply({
            embeds: [
              embed.setDescription(
                "🔹 | You either forgot to provide a user or some text."
              ),
            ],
          });

        const image = await imageGen.generate("phcomment", {
          image: avatar,
          text: text,
          username: username,
        });

        embed.setImage(image);
        return interaction.editReply({ embeds: [embed] });
      }
      case "ship": {
        if (!user1?.avatarURL() || user2?.avatarURL())
          return interaction.reply({
            embeds: [
              embed.setDescription("🔹 | You forgot to mention two users."),
            ],
          });

        const image = await imageGen.generate("ship", {
          user1: user1?.avatarURL(),
          user2: user2?.avatarURL(),
        });

        return interaction.editReply({ embeds: [embed.setImage(image)] });
      }
      case "threats": {
        if (!avatar)
          return interaction.reply({
            embeds: [
              embed.setDescription("🔹 | You forgot to mention a user."),
            ],
          });

        const image = await imageGen.generate("threats", {
          url: avatar,
        });

        return interaction.editReply({ embeds: [embed.setImage(image)] });
      }
      case "trash": {
        if (!avatar)
          return interaction.reply({
            embeds: [
              embed.setDescription("🔹 | You forgot to mention a user."),
            ],
          });

        const image = await imageGen.generate("trash", {
          url: avatar,
        });

        return interaction.editReply({ embeds: [embed.setImage(image)] });
      }
      case "trumptweet": {
        if (!text)
          return interaction.reply({
            embeds: [
              embed.setDescription("🔹 | You forgot to provide some text."),
            ],
          });

        const image = await imageGen.generate("trumptweet", {
          text: text,
        });

        return interaction.editReply({ embeds: [embed.setImage(image)] });
      }
      case "tweet": {
        if (!user1?.username || !user2.username || !text)
          return interaction.reply({
            embeds: [
              embed.setDescription(
                "🔹 | You either forgot to provide two users, some text or maybe even both."
              ),
            ],
          });

        const image = await imageGen.generate("tweet", {
          username: user1?.username || user2?.username,
          text: text,
        });

        return interaction.editReply({ embeds: [embed.setImage(image)] });
      }
      case "whowouldwin": {
        if (!user1?.avatarURL() || !user2?.avatarURL())
          return interaction.reply({
            embeds: [
              embed.setDescription("🔹 | You forgot to provide two users."),
            ],
          });

        const image = await imageGen.generate("whowouldwin", {
          user1: user1?.avatarURL(),
          user2: user2?.avatarURL(),
        });

        return interaction.editReply({ embeds: [embed.setImage(image)] });
      }
    }
  },
};
