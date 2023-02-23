const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const {
	replacePlaceholders,
} = require('../../../functions/replacePlaceholders.js');
const GDB = require('../../../structures/schemas/guild.js');

module.exports = {
	subCommand: 'goodbye.preview-embed',
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { options, guildId, member } = interaction;
		const channel = options.getChannel('channel');
		const data = await GDB.findOne({ id: guildId });

		const nEmbed = new EmbedBuilder().setColor('Blurple');

		const embed = data.goodbye.embed;
		const goodbyeEmbed = new EmbedBuilder();
		const content = data.goodbye.embed.messagecontent;
		const goodbyeMessage = replacePlaceholders(content, member);

		if (embed.color) {
			const hexCodeRegex = /^#[0-9A-Fa-f]{6}$/;
			if (hexCodeRegex.test(embed.color)) goodbyeEmbed.setColor(embed.color);
		}

		if (embed.title) goodbyeEmbed.setTitle(embed.title);

		if (embed.description)
			goodbyeEmbed.setDescription(
				replacePlaceholders(embed.description, member) || 'Undefined',
			);

		if (embed.author)
			goodbyeEmbed.setAuthor({
				name: replacePlaceholders(embed.author.name, member) || 'Undefined',
				iconURL: embed.author.icon_url,
			});

		if (embed.footer)
			goodbyeEmbed.setFooter({
				text: replacePlaceholders(embed.footer.text, member) || 'Undefined',
				iconURL: embed.footer.icon_url,
			});

		if (embed.image?.url) goodbyeEmbed.setImage(embed.image?.url);
		if (embed.thumbnail?.url) goodbyeEmbed.setThumbnail(embed.thumbnail.url);

		if (content) {
			channel.send({
				content: goodbyeMessage,
				embeds: [goodbyeEmbed],
			});
		}
		else {
			channel.send({
				embeds: [goodbyeEmbed],
			});
		}

		return interaction.reply({
			embeds: [
				nEmbed.setDescription(
					`🔹 | Preview has been sent to <#${channel.id}>.`,
				),
			],
			ephemeral: true,
		});
	},
};
