import { Evelyn } from './structures/Evelyn.js';
import { token } from './structures/config.json';

const client = new Evelyn();
client.login(token);
