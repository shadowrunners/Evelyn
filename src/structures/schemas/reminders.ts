import { model, Schema } from 'mongoose';

export const Reminders = model(
	'Reminders',
	new Schema({
		guildId: String,
		channelId: String,
		messageId: String,
		userId: String,
		reminder: String,
		scheduledTime: String,
		hasBeenReminded: Boolean,
	})
);