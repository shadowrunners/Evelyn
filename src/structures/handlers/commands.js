const glob = require('glob');
const { Client } = require("discord.js")
const { magenta, green } = require("chalk");

module.exports = (client) => {
    /**
    * @param {Client} client
     */

    glob(`${(process.cwd().replace(/\\/g, "/"))}/src/commands/**/*.js`, function(err, files) {
        files.map(async (file) => {
            const command = require(file);

            if(!command.name) {
                delete require.cache[require.resolve(file)];
                return console.log(`${file.split("/").pop()} does not have a command name! Removing the command.`)
            }

            if(command.public) {
                console.log(magenta('[') + magenta('Commands') + magenta(']') + ' Loaded' + green(` ${command.name}.js`))
            }

            client.commands.set(command.name, command);
            delete require.cache[require.resolve(file)];
        });
    });
}