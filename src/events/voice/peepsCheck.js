const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'voiceStateUpdate',
	execute(oldState, newState, client) {
		const player = client.manager.players.get(oldState.guild.id);

		if (player && !newState.guild.members.me.voice.channel) player.destroy();

		const getMyVCId = oldState.channelId === oldState.guild.members.cache.get(client.user.id).voice.channelId;
		if (!getMyVCId) return;

		const usersConnected = oldState.guild.members.me.voice.channel?.members.size;
		if (usersConnected === 1) {
			setTimeout(() => {
				if (player) player?.destroy();

				const textChannel = oldState.guild.channels.cache.get(player?.textId);
				textChannel?.send({
					embeds: [
						new EmbedBuilder()
							.setColor('Blurple')
							.setDescription('I have left your VC due to it being empty to save resources.'),
					],
				});
			}, 30000);
		}
	},
};
