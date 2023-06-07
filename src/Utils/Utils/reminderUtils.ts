import { EmbedBuilder, Message } from 'discord.js';
import { Reminders as DB } from '../../Schemas/reminders.js';

export async function reminded(message: Message) {
	const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
	const { interaction, guild } = message;

	const data = await DB.findOne({
		guildId: guild.id,
		userId: interaction.user.id,
		hasBeenReminded: false,
	});

	if (!data) return;
	if (data.hasBeenReminded === true) return;

	const user = await guild.members.fetch(data.userId);

	user
		.send({
			embeds: [
				embed
					.setTitle('Reminder')
					.setDescription(`Hiya! I'm here to remind to \`${data.reminder}\`.`),
			],
		})
		.then(async () => {
			await DB.findOneAndUpdate(
				{
					guildId: data.guildId,
					userId: data.userId,
					scheduledTime: data.scheduledTime,
				},
				{ hasBeenReminded: true },
			);
		});
}
