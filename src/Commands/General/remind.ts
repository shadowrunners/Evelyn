import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';
import { Reminders } from '../../Structures/Schemas/reminders';
import { reminded } from '../../Functions/reminderUtils';
import { Command } from '../../interfaces/interfaces';
import { Util } from '../../Modules/Utils/utils';

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('remind')
		.setDescription('Sets a reminder for you.')
		.addStringOption((options) =>
			options
				.setName('task')
				.setDescription('What should I remind you of?')
				.setRequired(true),
		)
		.addStringOption((options) =>
			options
				.setName('time')
				.setDescription('When should I remind you?')
				.setRequired(true),
		),
	execute(interaction: ChatInputCommandInteraction) {
		const { msToTime } = new Util();
		const { options, guild, channel, user } = interaction;
		const task = options.getString('task');
		const time = msToTime(options.getString('time'));
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const unixTime = Math.floor(Date.now() / 1000) + time / 1000;

		if (isNaN(time))
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | An invalid time has been provided.'),
				],
				ephemeral: true,
			});

		interaction
			.reply({
				embeds: [
					embed
						.setTitle('Reminder set!')
						.setDescription(
							`Okay, I'll remind you to \`${task}\` <t:${unixTime}:R>.`,
						),
				],
				fetchReply: true,
			})
			.then(async (message) => {
				await Reminders.create({
					guildId: guild.id,
					channelId: channel.id,
					messageId: message.id,
					userId: user.id,
					scheduledTime: parseInt(String(Date.now() + time / 1000)),
					reminder: task,
					hasBeenReminded: false,
				}).then((data) => {
					setTimeout(async () => {
						if (!data.hasBeenReminded) await reminded(message);
					}, time);
				});
			});
	},
};

export default command;
