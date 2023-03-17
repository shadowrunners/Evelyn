import { model, Schema } from 'mongoose';

export const LockdownDB = model(
	'Lockdowns',
	new Schema({
		guildId: String,
		channelId: String,
		timeLocked: String,
	}),
);
