const { glob } = require("glob");
const { promisify } = require("util");
const proGlob = promisify(glob);

async function fileLoad(dir) {
  const files = await proGlob(
    `${process.cwd().replace(/\\/g, "/")}/src/${dir}/**/*.js`
  );
  files.forEach((file) => delete require.cache[require.resolve(file)]);
  return files;
}

module.exports = { fileLoad };
