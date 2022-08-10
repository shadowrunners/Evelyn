const {
  Client,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("activity")
    .setDescription("Run activities with your homies.")
    .addStringOption((option) =>
      option
        .setName("activity")
        .setDescription("Provide an activity.")
        .setRequired(true)
        .addChoices(
          { name: "🔹 | Sketch Heads", value: "sketchheads" },
          { name: "🔹 | Word Snacks", value: "wordsnacks" },
          { name: "🔹 | Doodle Crew", value: "doodlecrew" },
          { name: "🔹 | Poker Night", value: "pokernight" },
          { name: "🔹 | Chess in the Park", value: "chess" },
          { name: "🔹 | Letter League", value: "letterleague" },
          { name: "🔹 | SpellCast", value: "spellcast" },
          { name: "🔹 | Checkers in the Park", value: "checkers" },
          { name: "🔹 | Blazing 8s", value: "blazing8s" },
          { name: "🔹 | Puttparty", value: "puttparty" },
          { name: "🔹 | Land.io", value: "landio" },
          { name: "🔹 | Bobble League", value: "bobbleleague" },
          { name: "🔹 | Ask Away", value: "askaway" },
          { name: "🔹 | Know What I Meme", value: "meme" },
          { name: "🔹 | Betrayal.io", value: "betrayal" },
          { name: "🔹 | Fishington", value: "fishington" },
          { name: "🔹 | Sketchy Artist", value: "sketchyartist" },
          { name: "🔹 | Awkword", value: "awkword" }
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { member, options } = interaction;
    const choices = options.getString("activity");

    const VC = member.voice.channel;

    function startActivity(activity) {
      client.DiscordTogether.createTogetherCode(VC.id, activity).then(
        async (invite) => {
          const embed = new EmbedBuilder()
            .setColor("Grey")
            .setTitle("Activity Launched")
            .setDescription(
              `Your activity has been launched, you can access it using [this](${invite.code}).`
            )
            .setTimestamp();

          interaction.reply({ embeds: [embed] });
        }
      );
    }

    const noVC = new EmbedBuilder()
      .setColor("Grey")
      .setDescription(
        "🔹 | You need to be in a voice channel to use this command."
      );

    if (!VC) return interaction.reply({ embeds: [noVC] });

    switch (choices) {
      case "watchtogether":
        {
          startActivity("watchtogether");
        }
        break;
      case "sketchheads":
        {
          startActivity("sketchheads");
        }
        break;
      case "wordsnacks":
        {
          startActivity("wordsnacks");
        }
        break;
      case "doodlecrew":
        {
          startActivity("doodlecrew");
        }
        break;
      case "pokernight":
        {
          startActivity("pokernight");
        }
        break;
      case "chess":
        {
          startActivity("chess");
        }
        break;
      case "letterleague":
        {
          startActivity("letterleague");
        }
        break;
      case "spellcast":
        {
          startActivity("spellcast");
        }
        break;
      case "checkers":
        {
          startActivity("checkers");
        }
        break;
      case "blazing8s":
        {
          startActivity("blazing8s");
        }
        break;
      case "puttparty":
        {
          startActivity("puttparty");
        }
        break;
      case "landio":
        {
          startActivity("landio");
        }
        break;
      case "bobbleleague":
        {
          startActivity("bobbleleague");
        }
        break;
      case "askaway":
        {
          startActivity("askaway");
        }
        break;
      case "meme":
        {
          startActivity("meme");
        }
        break;
      case "betrayal":
        {
          startActivity("betrayal");
        }
        break;
      case "fishington":
        {
          startActivity("fishington");
        }
        break;
      case "sketchyartist":
        {
          startActivity("sketchyartist");
        }
        break;
      case "awkword":
        {
          startActivity("awkword");
        }
        break;
    }
  },
};
