import { glob } from 'glob';
import { promisify } from "util";
const proGlob = promisify(glob);

/** Loads the files from the provided directory. */
export async function fileLoad(dir: string) {
	const files = await proGlob(
		`${process.cwd().replace(/\\/g, '/')}/dist/${dir}/**/*.js`,
	);
	files.forEach((file) => delete require.cache[require.resolve(file)]);
	return files;
}
