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
          { name: "🔹 | Watch Together", value: "watchtogether" },
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

    const noVC = new EmbedBuilder()
      .setColor("Grey")
      .setDescription(
        "🔹 | You need to be in a voice channel to use this command."
      );

    if (!VC) return interaction.reply({ embeds: [noVC] });

    function getInvite(activity) {
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
    switch (choices) {
      case "watchtogether":
        {
          getInvite("watchtogether");
        }
        break;
      case "sketchheads":
        {
          getInvite("sketchheads");
        }
        break;
      case "wordsnacks":
        {
          getInvite("wordsnacks");
        }
        break;
      case "doodlecrew":
        {
          getInvite("doodlecrew");
        }
        break;
      case "pokernight":
        {
          getInvite("pokernight");
        }
        break;
      case "chess":
        {
          getInvite("chess");
        }
        break;
      case "letterleague":
        {
          getInvite("letterleague");
        }
        break;
      case "spellcast":
        {
          getInvite("spellcast");
        }
        break;
      case "checkers":
        {
          getInvite("checkers");
        }
        break;
      case "blazing8s":
        {
          getInvite("blazing8s");
        }
        break;
      case "puttparty":
        {
          getInvite("puttparty");
        }
        break;
      case "landio":
        {
          getInvite("landio");
        }
        break;
      case "bobbleleague":
        {
          getInvite("bobbleleague");
        }
        break;
      case "askaway":
        {
          getInvite("askaway");
        }
        break;
      case "meme":
        {
          getInvite("meme");
        }
        break;
      case "betrayal":
        {
          getInvite("betrayal");
        }
        break;
      case "fishington":
        {
          getInvite("fishington");
        }
        break;
      case "sketchyartist":
        {
          getInvite("sketchyartist");
        }
        break;
      case "awkword":
        {
          getInvite("awkword");
        }
        break;
    }
  },
};
