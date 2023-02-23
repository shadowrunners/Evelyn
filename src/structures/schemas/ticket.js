const { Schema, model } = require('mongoose');

module.exports = model(
	'Tickets',
	new Schema({
		id: String,
		ticketId: String,
		closed: Boolean,
		closer: String,
		creatorId: String,
	}),
);
