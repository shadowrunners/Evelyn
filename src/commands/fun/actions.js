const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const { waifuFetch } = require("../../utils/imageAPIs.js");

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
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options } = interaction;

    try {
      switch (options.getSubcommand()) {
        case "bite": {
          const target = options.getUser("target");
          const data = await waifuFetch("bite");

          if (target.id === interaction.user.id)
            return interaction.reply({
              content: "No. <:peepo_stare:640305010135007255>",
            });

          const biteEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} bites ${target.username}!`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();

          return interaction.reply({ embeds: [biteEmbed] });
        }
        case "blush": {
          const data = await waifuFetch("blush");

          const blushEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} blushes. ;)`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [blushEmbed] });
        }
        case "bonk": {
          const target = options.getUser("target");
          const data = await waifuFetch("bonk");

          const bonkieEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} bonks... themselves?`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();

          if (target.id === interaction.user.id)
            return interaction.reply({ embeds: [bonkieEmbed] });

          const bonkietwo = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} bonks ${target.username}!`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [bonkietwo] });
        }
        case "bully": {
          const target = options.getUser("target");
          const data = await waifuFetch("bully");

          if (target.id === interaction.user.id)
            return interaction.reply({
              content:
                "Oh, I'm sure your friends do that to you enough already. Well, if you have any. :)",
            });

          const bullyEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} bullies ${target.username}!`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [bullyEmbed] });
        }
        case "cringe": {
          const data = await waifuFetch("cringe");

          const prettyCringe = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} thinks that's pretty cringe.`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [prettyCringe] });
        }
        case "cry": {
          const data = await waifuFetch("cry");

          const cryEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} is crying.. :c`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [cryEmbed] });
        }
        case "cuddle": {
          const target = options.getUser("target");
          const data = await waifuFetch("cuddle");

          const lonerCuddle = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${client.user.username} cuddles ${interaction.user.username}!`,
              iconURL: `${client.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();

          if (target.id === interaction.user.id)
            return interaction.reply({ embeds: [lonerCuddle] });

          const cuddleEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} cuddles ${target.username}!`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [cuddleEmbed] });
        }
        case "handhold": {
          const target = options.getUser("target");
          const data = await waifuFetch("handhold");

          const lonerhld = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} is holding hands with ${client.user.username}!`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();

          if (target.id === interaction.user.id)
            return interaction.reply({ embeds: [lonerhld] });

          const handholdEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} is holding hands with ${target.username}!`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [handholdEmbed] });
        }
        case "highfive": {
          const target = options.getUser("target");
          const data = await waifuFetch("highfive");

          const lonerFive = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} highfives ${client.user.username}!`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({ text: "You're doing great, honey. <3" })
            .setImage(data)
            .setTimestamp();

          if (target.id === interaction.user.id)
            return interaction.reply({ embeds: [lonerFive] });

          const highfiveEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} highfives ${target.username}!`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [highfiveEmbed] });
        }
        case "hug": {
          const target = options.getUser("target");
          const data = await waifuFetch("hug");

          const lonerHug = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${client.user.username} hugs ${interaction.user.username}!`,
              iconURL: `${client.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();

          if (target.id === interaction.user.id)
            return interaction.reply({ embeds: [lonerHug] });

          const hugEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} hugs ${target.username}!`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [hugEmbed] });
        }
        case "kiss": {
          const target = options.getUser("target");
          const data = await waifuFetch("kiss");

          if (target.id === interaction.user.id) {
            const lonerKiss = new EmbedBuilder()
              .setColor("Grey")
              .setAuthor({
                name: `${client.user.username} kisses ${target.username}!`,
                iconURL: `${client.user.avatarURL({ dynamic: true })}`,
              })
              .setFooter({
                text: "This image was brought to you by the waifu.pics API.",
              })
              .setImage(data)
              .setTimestamp();
            return interaction.reply({ embeds: [lonerKiss] });
          }

          const kissEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} kisses ${target.username}!`,
              iconURL: `${target.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [kissEmbed] });
        }
        case "pat": {
          const target = options.getUser("target");
          const data = await waifuFetch("pat");

          const lonerPat = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${client.user.username} pats ${interaction.user.username}!`,
              iconURL: `${client.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();

          if (target.id === interaction.user.id)
            return interaction.reply({ embeds: [lonerPat] });

          const patEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} pats ${target.username}!`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [patEmbed] });
        }
        case "poke": {
          const target = options.getUser("target");
          const data = await waifuFetch("poke");

          const lonerPoke = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${client.user.username} pokes ${interaction.user.username}!`,
              iconURL: `${client.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();

          if (target.id === interaction.user.id)
            return interaction.reply({ embeds: [lonerPoke] });

          const pokeEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} pokes ${target.username}!`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [pokeEmbed] });
        }
        case "slap": {
          const target = options.getUser("target");
          const data = await waifuFetch("slap");

          if (target.id === interaction.user.id)
            return interaction.reply({
              content: "Why would you wanna slap yourself, silly?",
              ephemeral: true,
            });

          const slapEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} slaps ${target.username}!`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [slapEmbed] });
        }
        case "wave": {
          const target = options.getUser("target");
          const data = await waifuFetch("wave");

          const lonerWave = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${client.user.username} waves at ${target.username}!`,
              iconURL: `${client.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();

          if (target.id === interaction.user.id)
            return interaction.reply({ embeds: [lonerWave] });

          const waveEmbed = new EmbedBuilder()
            .setColor("Grey")
            .setAuthor({
              name: `${interaction.user.username} waves at ${target.username}!`,
              iconURL: `${interaction.user.avatarURL({ dynamic: true })}`,
            })
            .setFooter({
              text: "This image was brought to you by the waifu.pics API.",
            })
            .setImage(data)
            .setTimestamp();
          return interaction.reply({ embeds: [waveEmbed] });
        }
      }
    } catch {
      const errorEmbed = new EmbedBuilder()
        .setColor("Grey")
        .setDescription(
          "Evelyn has ran into an error contacting the API. Please report this issue to the support server."
        )
        .setTimestamp();
      return interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
