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
    async execute(client) {
        console.log("QOTD event fired.")
        DB.find().then((data) => {
            console.log(data)
            data.forEach(async (docs) => {
                console.log("Reached data forEach.")
                if (!docs.qotd) return;
                console.log("Passed data check.")

                const guild = client.guilds.cache.get(docs.id);
                console.log(guild)
                if (!guild) return;

                console.log("Passed guild check.")

                if (!docs?.qotd.enabled || !docs?.qotd.channel) return;
                console.log("Passed data check.")

                const QOTDChannel = docs.qotd.channel;

                schedule("* * * * *", async function () {
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
