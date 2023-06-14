const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
  
module.exports = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("music.")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("query")
                .setDescription("User to be banned.")
                .setRequired(true)
        ),

    async execute(interaction, client, player, track) {
      
      const { guild, options, member, channelId, user } = interaction;
		 		
		await interaction.deferReply();

		const query = options.getString('query');
		const res = await client.manager.resolve({query, requester: user });
		const { tracks } = res;

   const results = tracks.slice(0, 10);

        let n = 0;

        const str = tracks
            .slice(0, 10)
            .map(
                (r) =>
                    `\`${++n}.\` **[${r.title.length > 20 ? r.title.substr(0, 25) + "..." : r.title}](${r.uri})** • ${
                        r.author
                    }`,
            )
            .join("\n");

        const selectMenuArray = [];

        for (let i = 0; i < results.length; i++) {
            const track = results[i];

            let label = `${i + 1}. ${track.title}`;

            if (label.length > 50) label = label.substring(0, 47) + "...";

            selectMenuArray.push({
                label: label,
                description: track.author,
                value: i.toString(),
            });
        }

      const selection = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("search")
                .setPlaceholder("Please select your song here")
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(selectMenuArray),
        ]);

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Seach Selection Menu", iconURL: interaction.member.displayAvatarURL({}) })
            .setDescription(str)
            .setColor("Red")
            .setFooter({ text: `You have 30 seconds to make your selection through the dropdown menu.` });

        await interaction.editReply({ embeds: [embed], components: [selection] }).then((message) => {
            let count = 0;

            const selectMenuCollector = message.createMessageComponentCollector({ time: 30000 });
            const toAdd = [];

            try {
                selectMenuCollector.on("collect", async (menu) => {
                    if (menu.user.id !== interaction.member.id) {
                        const unused = new EmbedBuilder().setColor("Red").setDescription(`\`❌\` | This menu is not for you!`);

                        return menu.reply({ embeds: [unused], ephemeral: true });
                    }

                    menu.deferUpdate();

                  if(!player) {
                    player = client.manager.create({
			guildId: guild.id,
			voiceChannel: member.voice.channelId,
			textChannel: channelId,
			deaf: true,
		});
                  }

                  if (player.state !== "CONNECTED") player.connect();

                    for (const value of menu.values) {
                        toAdd.push(tracks[value]);
                        count++;
                    }

                    for (const track of toAdd) {
                        player.queue.add(track);
                    }

                    const tplay = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `\`➕\` | [${res.tracks[0].title}](${res.tracks[0].uri}) • ${interaction.member}`,
                        );

                    await message.edit({ embeds: [tplay], components: [] });
                    if (!player.isPlaying && !player.isPaused) return player.play();
                });

                selectMenuCollector.on("end", async (collected) => {
                    if (!collected.size) {
                        const timed = new EmbedBuilder().setColor("Red").setDescription(`\`❌\` | Search was time out.`);

                        return message.edit({ embeds: [timed], components: [] });
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });
        
    },
 };
