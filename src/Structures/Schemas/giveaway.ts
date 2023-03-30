import { model, Schema } from 'mongoose';

export const GiveawayDB = model(
	'Giveaways',
	new Schema({
		guildId: String,
		channelId: String,
		messageId: String,
		winners: Number,
		prize: String,
		endTime: String,
		isPaused: Boolean,
		hasEnded: Boolean,
		hoster: String,
		enteredUsers: Array,
	}),
);
