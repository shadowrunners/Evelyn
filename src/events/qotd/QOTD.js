const { Client } = require("discord.js");
const { schedule } = require("node-cron");
const DB = require("../../structures/schemas/guild.js");
const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        DB.find().then((data) => {
            data.forEach((docs) => {
                if (!docs.qotd) return;

                const guild = client.guilds.cache.get(docs.id);
                if (!guild) return;

                if (!docs?.qotd.enabled || !docs?.qotd.channel) return;
                const QOTDChannel = docs.qotd.channel;

                schedule("0 23 * * *", async function () {
                    let questions = JSON.parse(readFileSync(resolve(__dirname, '../../utils/QOTD.json')));
                    console.log(questions)
                    const question = questions[Math.floor(Math.random() * questions.length)];
                    console.log(question)
                    console.log("Fired scheduler!")
                    await client.channels.cache.get(QOTDChannel).send({ content: `${question.question}` })
                    questions = questions.filter(e => e.id !== question.id);
                    console.log(questions)
                    writeFileSync(resolve(__dirname, '../../utils/QOTD.json'), JSON.stringify(questions));
                    console.log("QOTD sent!")
                    return;
                })
            })
        })
    },
};
