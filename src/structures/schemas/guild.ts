import { model, Schema } from 'mongoose';

export const GuildDB = model(
	'GuildDB',
	new Schema({
		id: String,

		logs: {
			enabled: Boolean,
			channel: String,
			webhook: {
				id: String,
				token: String,
			},
		},
		welcome: {
			enabled: Boolean,
			channel: String,
			embed: Object,
		},
		goodbye: {
			enabled: Boolean,
			channel: String,
			embed: Object,
		},
		blacklist: {
			isBlacklisted: Boolean,
			reason: String,
			time: Number,
		},
		tickets: {
			enabled: Boolean,
			embed: Object,
			transcriptChannel: String,
			assistantRole: String,
		},
		levels: {
			enabled: Boolean,
			channel: String,
			message: String,
		},
		qotd: {
			enabled: Boolean,
			channel: String,
		},
		confessions: {
			enabled: Boolean,
			channel: String,
			webhook: {
				id: String,
				token: String,
			},
		},
	}),
);
