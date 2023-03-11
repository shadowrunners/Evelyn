const { model, Schema } = require('mongoose');

module.exports = model(
	'GuildDB',
	new Schema({
		id: String,

		logs: {
			enabled: Boolean,
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
			time: String,
		},
		tickets: {
			enabled: Boolean,
			embed: Object,
			category: String,
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
			webhook: {
				id: String,
				token: String,
			},
		},
	}),
);
