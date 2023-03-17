import { model, Schema } from 'mongoose';

export const RRoles = model(
	'Roles',
	new Schema({
		panelName: String,
		id: String,
		roleArray: Array,
	}),
);
