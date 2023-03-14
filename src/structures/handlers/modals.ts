import { Evelyn } from '../Evelyn';
import { magenta, green, white } from 'chalk';
import { fileLoad } from '../../functions/fileLoader';

/** Loads all modals. */
export async function loadModals(client: Evelyn) {
    const files = await fileLoad('modals');
    for (const file of files) {
        const modal = require(file);
        if (!modal.id) return;

        client.modals.set(modal.id, modal);

        return console.log(magenta('Modals') + ' ' + white('· Loaded') + ' ' + green(modal.id + '.js'));
    };
}
