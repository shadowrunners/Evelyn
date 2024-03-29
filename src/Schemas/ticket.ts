import { model, Schema } from 'mongoose';

export const Tickets = model(
	'Tickets',
	new Schema({
		id: String,
		ticketId: String,
		claimed: Boolean,
		claimer: String,
		closed: Boolean,
		closer: String,
		creatorId: String,
	}),
);
