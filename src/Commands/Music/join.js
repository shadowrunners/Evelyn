const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
  } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('join')
      .setDescription(`Invite bot to your voice channel..`)
      .setDMPermission(false),

    /**

     *

     * @param {ChatInputCommandInteraction} interaction

     * @param {Client} client

     */

    async execute(interaction, client, player) {

  await interaction.deferReply();

      const { guildId, guild, channelId, member } = interaction;  

      if (player) {

            const embed = new EmbedBuilder().setColor("Red").setDescription(`\`❌\` | I already joined a voice channel.`);

            return interaction.editReply({ embeds: [embed] });

      }

      if(!player) {

        player = await client.manager.create({
          guildId: guild.id,
          voiceChannel: member.voice.channelId,
		textChannel: channelId,			
          deaf: true,
        })

      await player.connect();

            const embed = new EmbedBuilder()

                .setColor("Green")
                .setDescription(`\`☑️\` | Joined to ${interaction.member.voice.channel.toString()}`);

            return interaction.editReply({ embeds: [embed] });

    }     

    },

  };
