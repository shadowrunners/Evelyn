const { glob } = require('glob');
const { join, resolve, extname } = require('path');

async function deleteCachedFile(file) {
	const filePath = resolve(file);
	if (require.cache[filePath]) delete require.cache[filePath];
}

async function fileLoad(dir) {
	try {
		const files = await glob(
			join(`${process.cwd()}/src/`, dir, '**/*.js').replace(/\\/g, '/'),
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

module.exports = { fileLoad };
