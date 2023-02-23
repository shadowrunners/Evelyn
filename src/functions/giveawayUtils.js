const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const DB = require('../structures/schemas/giveaway.js');
const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

function getMultipleRandom(arr, num) {
	const shuffled = [...arr].sort(() => 0.5 - Math.random());
	return [...new Set(shuffled.slice(0, num))];
}

async function endGiveaway(message, reroll = false) {
	if (!message.guild) return;
	await message.client.guilds.fetch();
	if (!message.client.guilds.cache.get(message.guild.id)) return;

	const data = await DB.findOne({
		guildId: message.guild.id,
		messageId: message.id,
	});

	if (!data) return;
	if (
		!message.guild.channels.cache
			.get(data.channelId)
			?.messages.fetch(data.messageId)
	)
		return;

	if (data.hasEnded === true && !reroll) return;
	if (data.isPaused === true) return;

	const winnerIdArray = [];
	if (data.enteredUsers.length > data.winners) {
		winnerIdArray.push(...getMultipleRandom(data.enteredUsers, data.winners));
		while (winnerIdArray.length < data.winners)
			winnerIdArray.push(
				getMultipleRandom(
					data.enteredUsers,
					data.winners - winnerIdArray.length,
				),
			);
	}
	else winnerIdArray.push(...data.enteredUsers);

	const disableButton = ActionRowBuilder.from(
		message.components[0],
	).setComponents(
		ButtonBuilder.from(message.components[0].components[0]).setDisabled(true),
	);

	const endGiveawayEmbed = EmbedBuilder.from(message.embeds[0])
		.setColor('Blurple')
		.setTitle(`${data.prize} [Ended]`);

	await DB.findOneAndUpdate(
		{
			guildId: data.guildId,
			channelId: data.channelId,
			messageId: message.id,
		},
		{ hasEnded: true },
	);

	await message.edit({
		embeds: [endGiveawayEmbed],
		components: [disableButton],
	});

	message.reply({
		content: winnerIdArray.length
			? `🥳 Congratulations ${winnerIdArray
				.map((user) => `<@${user}>`)
				.join(', ')}, you won **${data.prize}**! 🥳`
			: 'No winner was decided because no one entered the giveaway. ☹️',
	});
}

function check4Data(data, interaction) {
	if (!data) {
		embed.setDescription(
			'🔹 | There is no data in the database regarding that giveaway.',
		);
		return interaction.reply({ embeds: [embed], ephemeral: true });
	}
}

function check4Message(message, interaction) {
	if (!message) {
		embed.setDescription('🔹 | This giveaway doesn\'t exist.');
		return interaction.reply({ embeds: [embed], ephemeral: true });
	}
}

function check4Pause(data, interaction) {
	if (data.isPaused) {
		embed.setDescription(
			'🔹 | This giveaway is currently paused. Unpause it to end the giveaway.',
		);
		return interaction.reply({ embeds: [embed], ephemeral: true });
	}
}

function hasItEnded(data, interaction) {
	if (data.hasEnded) {
		embed.setDescription('🔹 | This giveaway has already ended.');
		return interaction.reply({ embeds: [embed], ephemeral: true });
	}
}

module.exports = {
	endGiveaway,
	check4Data,
	check4Message,
	check4Pause,
	hasItEnded,
};
