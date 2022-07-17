const { CommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
  name: "hackban",
  description: "Ban someone by only using their Discord ID.",
  permission: "BAN_MEMBERS",
  public: true,
  options: [
      {
          name: "target",
          description: "Specify a target.",
          type: 3,
          required: true
      },
      {
          name: "reason",
          description: "Provide a reason for the ban.",
          type: 3,
      },
  ],
    /**
     * @param {CommandInteraction} interaction 
     */
	async execute (interaction) {
    const target = interaction.options.getString("target");
    const reason = interaction.options.getString("reason") || "No reason provided.";

    interaction.guild.members.ban(target);
    const successEmbed = new EmbedBuilder()
        .setColor('BLURPLE')
        .setDescription("This user has been banned successfully.");

    interaction.reply({
      embeds: [successEmbed], ephemeral: true
    });
  },
};