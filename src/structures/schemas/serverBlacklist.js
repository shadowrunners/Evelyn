const { model, Schema } = require('mongoose');

module.exports = model(
	'SBlacklist',
	new Schema({
		guildId: String,
		reason: String,
		time: Number,
	}),
);
