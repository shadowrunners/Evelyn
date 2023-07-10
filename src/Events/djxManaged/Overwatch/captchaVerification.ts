import { GuildDB as DB } from '../../../Schemas/guild.js';
import { Evelyn } from '../../../Evelyn.js';
import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	GuildMember,
	ModalBuilder,
	ModalMessageModalSubmitInteraction,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
import { ButtonComponent, Discord, ModalComponent, On } from 'discordx';
import { CaptchaGenerator } from 'captcha-canvas';
import { ExtendedButtonInteraction } from '../../../Interfaces/Interfaces.js';

@Discord()
export class CaptchaVerify {
	private generatedCaptcha: CaptchaGenerator;
	private embed: EmbedBuilder;
	private guildId: string;

	@On({ event: 'guildMemberAdd' })
	async captcha([member]: [GuildMember], client: Evelyn) {
		const { guild } = member;
		this.guildId = guild.id;

		const data = await DB.findOne({ id: guild.id });

		if (!data?.verification?.enabled && !data?.verification?.role) return;

		this.generatedCaptcha = new CaptchaGenerator()
			.setDimension(150, 500)
			.setCaptcha({ font: 'Comic Sans', size: 60 })
			.setDecoy({ opacity: 0.8 })
			.setTrace({ color: 'red' });

		const imageBuffer = this.generatedCaptcha.generateSync();

		const attachment = new AttachmentBuilder(imageBuffer, {
			name: 'captcha.png',
		});

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
			.setImage('attachment://captcha.png')
			.setTimestamp();

		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('captcha_prompt')
				.setLabel('Verify')
				.setStyle(ButtonStyle.Primary),
		);

		await member
			.send({
				embeds: [promptEmbed],
				files: [attachment],
				components: [actionRow],
			})
			.catch(() => {});
	}

	@ButtonComponent({
		id: 'captcha_prompt',
	})
	async captcha_prompt(interaction: ExtendedButtonInteraction, client: Evelyn) {
		const modal = new ModalBuilder()
			.setCustomId('captcha_verifyModal')
			.setTitle('Prove your humanity')
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId('answer')
						.setLabel('Answer')
						.setStyle(TextInputStyle.Paragraph)
						.setRequired(true)
						.setMinLength(1),
				),
			);
		await interaction.showModal(modal);
	}

	@ModalComponent({
		id: 'captcha_verifyModal',
	})
	async captcha_verifyModal(
		interaction: ModalMessageModalSubmitInteraction,
		client: Evelyn,
	) {
		const { user, fields, message } = interaction;

		const data = await DB.findOne({ id: this.guildId });
		const guild = await client.guilds.fetch(this.guildId);
		const role = await guild.roles.fetch(data.verification.role);
		const member = await guild.members.fetch(user.id);
		const answer = fields.getTextInputValue('answer');

		this.embed = new EmbedBuilder()
			.setAuthor({
				name: 'Evelyn | Verification',
				iconURL: client.user.avatarURL(),
			})
			.setColor('Blurple')
			.setTimestamp();

		if (answer !== this.generatedCaptcha.text) {
			await member.kick('User failed verification.');
			return interaction.reply({
				embeds: [
					this.embed
						.setTitle('Connection Terminated')
						.setDescription(
							'🔒 | Verification failed. Only the humans shall pass the border.',
						),
				],
			});
		}

		await member.roles.add(role).catch(() => {
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'There has been an error when assigning your role. Contact a staff member to continue.',
					),
				],
			});
		});

		message.edit({
			embeds: [message.embeds[0]],
			components: [],
			files: [],
		});

		return interaction.reply({
			embeds: [
				this.embed.setDescription(
					`🔓 | Access granted. You've successfully proven your humanity. Enjoy your stay in ${member?.guild?.name}!`,
				),
			],
		});
	}
}
