import { model, Schema } from 'mongoose';

interface RRInterface {
	/** The name of the panel. */
	panelName: string;
	/** The ID of the server. */
	id: string;
	/** The array of roles. */
	roleArray: Array<any>;
}

export const RRoles = model<RRInterface>(
	'Roles',
	new Schema({
		panelName: String,
		id: String,
		roleArray: Array,
	}),
);
