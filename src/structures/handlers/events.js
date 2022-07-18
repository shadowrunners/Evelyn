const { Events } = require("./validation/eventnames");
const { magenta, green, red } = require("chalk");

module.exports = async(client, PG) => {
    (await PG(`${(process.cwd().replace(/\\/g, "/"))}/src/events/*/*.js`)).map(async (file) => {
        const event = require(file);

        if (event.name) {
            if(!Events.includes(event.name))
            return console.log(magenta('[') + magenta('Events') + magenta(']') + red(` Event name is missing in eventnames.js. (${event.name}.js)`));
        }
        
        if (event.rest && event.once) {
            client.rest.once(event.name, (...args) => event.execute(...args, client));
        };

        if(event.rest && !event.once) {
            client.rest.on(event.name, (...args) => event.execute(...args, client));
        };

        if(!event.rest && event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        }

        if (!event.rest && !event.once) {
            client.on(event.name, (...args) => event.execute(...args, client));
        };
        
        console.log(magenta('[') + magenta('Events') + magenta(']') + ' Loaded' + green(` ${event.name}.js`))
    });
}