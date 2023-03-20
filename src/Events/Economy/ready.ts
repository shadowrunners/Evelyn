import { Event } from '../../Interfaces/interfaces.js';

const event: Event = {
	name: 'ready',
	execute() {
		console.log('Economy system initialized.');
	},
};

export default event;
