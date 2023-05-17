import { model, Schema } from 'mongoose';

export const Playlists = model(
	'Playlists',
	new Schema({
		playlistName: String,
		playlistData: Array,
		createdBy: String,
		userID: String,
		created: Number,
	}),
);
