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
          return interaction.reply({ embeds: [embed] });
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
      case "watchtogether": {
        startActivity("watchtogether");
      }
      case "sketchheads": {
        startActivity("sketchheads");
      }
      case "wordsnacks": {
        startActivity("wordsnacks");
      }
      case "doodlecrew": {
        startActivity("doodlecrew");
      }
      case "pokernight": {
        startActivity("pokernight");
      }
      case "chess": {
        startActivity("chess");
      }
      case "letterleague": {
        startActivity("letterleague");
      }
      case "spellcast": {
        startActivity("spellcast");
      }
      case "checkers": {
        startActivity("checkers");
      }
      case "blazing8s": {
        startActivity("blazing8s");
      }
      case "puttparty": {
        startActivity("puttparty");
      }
      case "landio": {
        startActivity("landio");
      }
      case "bobbleleague": {
        startActivity("bobbleleague");
      }
      case "askaway": {
        startActivity("askaway");
      }
      case "meme": {
        startActivity("meme");
      }
      case "betrayal": {
        startActivity("betrayal");
      }
      case "fishington": {
        startActivity("fishington");
      }
      case "sketchyartist": {
        startActivity("sketchyartist");
      }
      case "awkword": {
        startActivity("awkword");
      }
    }
  },
};
