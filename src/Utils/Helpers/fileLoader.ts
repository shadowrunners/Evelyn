import { glob } from 'glob';
import { join, extname } from 'path';

/** Loads the files from the provided directory. */
export async function fileLoad(dir: string) {
	try {
		const files = await glob(
			join(`${process.cwd()}/src/`, dir, '**/*.{ts.js}').replace(/\\/g, '/'),
		);
		const jsFiles = files.filter((file) => extname(file) === '.ts' || extname(file) === '.js');
		return jsFiles;
	}
	catch (err) {
		console.error(
			`An error has occured when loading files from ${dir}: ${err}`,
		);
		throw err;
	}
}
