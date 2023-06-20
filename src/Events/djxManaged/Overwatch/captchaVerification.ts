import { GuildDB } from '../../../Schemas/guild.js';
import { Captcha } from 'discord.js-captcha';
import { Evelyn } from '../../../Evelyn.js';
import { EmbedBuilder, GuildMember } from 'discord.js';
import { Discord, On } from 'discordx';

@Discord()
export class CaptchaVerify {
	@On({ event: 'guildMemberAdd' })
	async captcha([member]: [GuildMember], client: Evelyn) {
		const { guild } = member;

		const data = await GuildDB.findOne({ id: guild.id });

		if (!data.verification.enabled && !data.verification.role) return;

		const successEmbed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: 'Evelyn | Verification',
				iconURL: client.user.avatarURL(),
			})
			.setDescription(
				`🔓 | Access granted. You've successfully proven your humanity. Enjoy your stay in ${member?.guild?.name}!`,
			)
			.setTimestamp();

		const promptEmbed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: 'Evelyn | Verification',
				iconURL: client.user.avatarURL(),
			})
			.setTitle('Beep boop, boop beep?')
			.setDescription(
				'🔒 | In order to protect this server from cyberpsychos and spam bots, you\'ll need to complete this captcha in order to gain access to the rest of the server.\n\nFailure to do so or failing the captcha 3 times in a row will result in you being kicked from the server.',
			)
			.setTimestamp();

		const failureEmbed = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({
				name: 'Evelyn | Verification',
				iconURL: client.user.avatarURL(),
			})
			.setTitle('Connection Terminated')
			.setDescription(
				'🔒 | Verification failed. Only the humans shall pass the border.',
			)
			.setTimestamp();

		const captcha = new Captcha(client, {
			roleID: data.verification.role,
			kickOnFailure: true,
			addRoleOnSuccess: true,
			caseSensitive: true,
			attempts: 3,
			timeout: 30000,
			customSuccessEmbed: successEmbed,
			customPromptEmbed: promptEmbed,
			customFailureEmbed: failureEmbed,
		});

		return captcha.present(member);
	}
}
