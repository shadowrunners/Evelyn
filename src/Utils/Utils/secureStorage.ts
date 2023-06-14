import cryptr from 'cryptr';
import { Evelyn } from '../../Evelyn.js';

export function encryptMyData(value: string, client: Evelyn) {
	const keepMyDataSecure = new cryptr(client.config.decryptionKey, {
		pbkdf2Iterations: 15000,
		saltLength: 15,
	});

	return keepMyDataSecure.encrypt(value);
}

export function pleaseDecryptMyData(encryptedValue: string, client: Evelyn) {
	if (!encryptedValue) return;

	const keepMyDataSecure = new cryptr(client.config.decryptionKey, {
		pbkdf2Iterations: 15000,
		saltLength: 15,
	});

	return keepMyDataSecure.decrypt(encryptedValue);
}
