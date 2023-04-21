import { glob } from 'glob';
import { join, resolve, extname } from 'path';

/** Deletes the cached file. */
function deleteCachedFile(file: string) {
	const filePath = resolve(file);
	if (require.cache[filePath]) delete require.cache[filePath];
}

/** Loads the files from the provided directory. */
export async function fileLoad(dir: string) {
	try {
		const files = await glob(
			join(`${process.cwd()}/dist/`, dir, '**/*.js').replace(/\\/g, '/'),
		);
		const jsFiles = files.filter((file) => extname(file) === '.js');
		await Promise.all(jsFiles.map(deleteCachedFile));
		return jsFiles;
	}
	catch (err) {
		console.error(
			`An error has occured when loading files from ${dir}: ${err}`,
		);
		throw err;
	}
}
