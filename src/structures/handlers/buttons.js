const { magenta, green } = require("chalk");

module.exports = async (client, PG) => {
    const buttonsFolder = await PG(`${(process.cwd().replace(/\\/g, "/"))}/src/buttons/**/*.js`);

    buttonsFolder.map(async (file) => {
        const buttonFile = require(file);
        if(!buttonFile.id) return;

        console.log(magenta('[') + magenta('Buttons') + magenta(']') + ' Loaded' + green(` ${buttonFile.id}.js`))
        client.buttons.set(buttonFile.id, buttonFile);
    });
}