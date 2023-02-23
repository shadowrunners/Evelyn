const { model, Schema } = require('mongoose');

module.exports = model(
	'GuildDB',
	new Schema({
		id: String,

		logs: {
			enabled: false,
			webhook: {
				id: String,
				token: String,
			},
		},
		welcome: {
			enabled: false,
			channel: String,
			embed: Object,
		},
		goodbye: {
			enabled: false,
			channel: String,
			embed: Object,
		},
		blacklist: {
			isBlacklisted: false,
			reason: String,
			time: String,
		},
		tickets: {
			enabled: false,
			embed: Object,
			category: String,
			transcriptChannel: String,
			assistantRole: String,
		},
		levels: {
			enabled: false,
			channel: String,
			message: String,
		},
		qotd: {
			enabled: false,
			channel: String,
		},
		confessions: {
			enabled: false,
			webhook: {
				id: String,
				token: String,
			},
		},
	}),
);
