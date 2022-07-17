const { ContextMenuInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'User Banner',
	type: 2,
	context: true,
	public: true,
	/**
	 * @param {ContextMenuInteraction} interaction  
	 */
	async execute (interaction) {
		const target = await interaction.guild.members.fetch(interaction.targetId);
		await target.user.fetch();

		const noBanner = new MessageEmbed()
			.setColor("DARK_VIVID_PINK")
			.setDescription("This user doesn't have a banner.")

		if (!target.user.banner) return interaction.reply({ embeds: [noBanner], ephemeral: true });

		const bannerEmbed = new MessageEmbed()
			.setColor("DARK_VIVID_PINK")
			.setAuthor({ name: `${target.user.username}'s Banner`, iconURL: target.user.avatarURL({ dynamic: true }) })
			.setDescription(`You can obtain their banner **[here](${target.user.bannerURL({ dynamic: true, format: 'png', size: 4096 })})** if you really like it.`)
			.setImage(target.user.bannerURL({ dynamic: true, format: 'png', size: 4096 }))
		interaction.reply({ embeds: [bannerEmbed], ephemeral: true });
	},
};
