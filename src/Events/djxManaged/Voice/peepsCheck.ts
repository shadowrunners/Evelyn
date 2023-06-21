import { Discord, On } from 'discordx';
import { Evelyn } from '../../../Evelyn.js';
import { EmbedBuilder, TextChannel, VoiceState } from 'discord.js';

@Discord()
export class VoiceUpdate {
	@On({
		event: 'voiceStateUpdate',
	})
	voiceStateUpdate(oldState: VoiceState, newState: VoiceState, client: Evelyn) {
		const player = client.manager?.players?.get(oldState.guild.id);

		if (player && !newState.guild.members.me.voice.channel) player.destroy();

		const getMyVCId =
			oldState.channelId ===
			oldState.guild?.members?.cache?.get(client.user.id).voice.channelId;
		if (!getMyVCId) return;

		const usersConnected =
			oldState.guild?.members?.me.voice.channel?.members.size;
		if (usersConnected === 1)
			setTimeout(() => {
				const embed = new EmbedBuilder()
					.setColor('Blurple')
					.setDescription(
						'I have left your VC due to it being empty to save resources.',
					)
					.setTimestamp();

				if (player) player?.destroy();

				const textChannel = oldState.guild?.channels?.cache?.get(
					player?.textChannel,
				) as TextChannel;

				textChannel?.send({ embeds: [embed] });
			}, 30000);
	}
}
