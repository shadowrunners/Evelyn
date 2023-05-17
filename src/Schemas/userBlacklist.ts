import { model, Schema } from 'mongoose';

export const UserBlacklist = model(
	'UBlacklist',
	new Schema({
		userId: String,
		reason: String,
		time: Number,
	}),
);