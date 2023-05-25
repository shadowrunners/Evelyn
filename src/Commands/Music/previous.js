const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
  } = require('discord.js');
const MusicUtils = require("../../../Functions/MusicUtils");

module.exports = {
    data: new SlashCommandBuilder()
      .setName('previous')
      .setDescription(`Return to the previous song.`)
      .setDMPermission(false),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
  await interaction.deferReply();

      const { guildId } = interaction;
      
     const player = client.manager.players.get(guildId);
      
        if (!player.queue.previuos) {
            const embed = new EmbedBuilder().setDescription(`\`❌\` | Previous song was: \`Not found\``).setColor("Red");

            return interaction.editReply({ embeds: [embed] });
             }

      await player.queue.unshift(player.queue.previuos);
        await player.stop();

        const embed = new EmbedBuilder().setColor("Red").setDescription(`\`⏮️\` | Song has been: \`Previoused\``);

        return interaction.editReply({ embeds: [embed] });
      
    },
  };
