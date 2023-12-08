import { model, Schema } from 'mongoose';

export const ReminderDB = model(
	'Reminders',
	new Schema({
		guildId: String,
		channelId: String,
		messageId: String,
		userId: String,
		reminder: String,
		scheduledTime: Number,
		hasBeenReminded: Boolean,
	}),
);
