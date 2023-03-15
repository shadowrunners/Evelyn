import { model, Schema } from 'mongoose';

export const RRoles = model(
	'Tickets',
	new Schema({
		panelName: String,
		id: String,
		roleArray: Array,
	})
);
