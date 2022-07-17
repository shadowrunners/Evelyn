const { Client, Message, MessageEmbed, MessageAttachment } = require("discord.js");
const { PerspectiveAPIKey } = require("../../structures/config.json");
const GDB = require("../../structures/schemas/guildDB.js");
const AMDB = require("../../structures/schemas/automodDB.js");
const Perspective = require("perspective-api-client");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

module.exports = {
    name: "messageCreate",
    /**
     *
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        const perspective = new Perspective({
            apiKey: PerspectiveAPIKey,
        });

        const guildData = await GDB.findOne({
            id: message.guild.id,
        })

        if (guildData.automod.enabled == "false") return;

        const { author, member, guild, channel } = message;
        const messageContent = message.content.toLowerCase().split(" ");

        const docs = await AMDB.findOne({
            id: message.guildId,
        });

        if (!docs) return;
        const { Punishments, LogChannelID, ChannelIDs, BypassRoles } = docs;

        const low = Punishments[0];
        const medium = Punishments[1];
        const high = Punishments[2];
        const logChannels = LogChannelID;

        try {
            if (BypassRoles.length > 0) {
                for (const role of BypassRoles) {
                    if (member.roles.cache.has(role)) {
                        return;
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }

        const analyzeRequest = {
            comment: {
                text: messageContent.toString(),
            },
            requestedAttributes: {
                TOXICITY: {},
            },
        };

        const speech = await perspective
            .analyze(analyzeRequest)
            .catch((err) => { });
        if (!speech || !speech.attributeScores) return;

        const score = speech.attributeScores.TOXICITY.summaryScore.value;

        const width = 1500;
        const height = 720;
        const scoreInt = Math.round(score * 100);

        const plugin = {
            id: "scoreText",
            beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext("2d");
                ctx.save();
                ctx.globalCompositeOperation = "destination-over";
                ctx.font = "800 90px Arial";
                ctx.fillStyle = "#DDDDDD";
                ctx.fillText(
                    `${scoreInt}%`,
                    chart.width / 2 - 75,
                    chart.height / 2 + 25
                );
                ctx.textAlign = "center";
                ctx.restore();
            },
        };

        const chartCallback = (ChartJS) => { };
        const canvas = new ChartJSNodeCanvas({
            width: width,
            height: height,
            chartCallback: chartCallback,
        });

        const data = {
            labels: ["Message"],
            datasets: [
                {
                    label: "Toxicity",
                    data: [score, 1 - score],
                    backgroundColor: ["#FF555599", "#FF555500"],
                    borderColor: ["#FF5555", "#FFFFFF00"],
                    borderWidth: [5, 0],
                    borderRadius: 25,
                    borderSkipped: false,
                },
            ],
        };

        const chartConfig = {
            type: "doughnut",
            data: data,
            plugins: [plugin],
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: false,
                        text: "Toxicity Score",
                    },
                    legend: {
                        display: false,
                    },
                },
            },
        };

        const image = await canvas.renderToBuffer(chartConfig);
        const attachment = new MessageAttachment(image, "chart.png");

        if (ChannelIDs.includes(channel.id)) {
            if (score > 0.75 && score <= 0.8) {
                if (low === "delete") {
                    message.delete();

                    logChannels.forEach((channel) => {
                        const eachChannel = guild.channels.cache.get(channel);

                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("AutoMod | A toxic message has been detected. [DELETED]")
                            .setDescription(
                                `AutoMod has detected a toxic message! The user has been served their set punishment.\n
                            **<:white_small_square:997471945564115014> User**: ${author} | ${author.id}
                            **<:white_small_square:997471945564115014> Channel**: ${message.channel}
                            ㅤ
                            `
                            )
                            .addFields(
                                {
                                    name: "Message: ",
                                    value: `\`\`\`${message}\`\`\``,
                                    inline: true,
                                },
                                {
                                    name: "Score: ",
                                    value: `\`\`\`${score}\`\`\``,
                                    inline: true,
                                }
                            )
                            .setImage("attachment://chart.png")
                            .setTimestamp();

                        eachChannel.send({
                            embeds: [embed],
                            files: [attachment],
                        });
                    });
                } else if (low === "timeout") {
                    message.delete();
                    member.timeout(
                        5 * 60000, // 5 minutes
                        "Toxicity Detected"
                    );

                    logChannels.forEach((channel) => {
                        const eachChannel = guild.channels.cache.get(channel);

                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("AutoMod | A toxic message has been detected. [TIMEOUT]")
                            .setDescription(
                                `AutoMod has detected a toxic message! The user has been served their set punishment.\n
                            **<:white_small_square:997471945564115014> User**: ${author} | ${author.id}
                            **<:white_small_square:997471945564115014> Channel**: ${message.channel}
                            ㅤ
                            `
                            )
                            .addFields(
                                {
                                    name: "Message: ",
                                    value: `\`\`\`${message}\`\`\``,
                                    inline: true,
                                },
                                {
                                    name: "Score: ",
                                    value: `\`\`\`${score}\`\`\``,
                                    inline: true,
                                }
                            )
                            .setImage("attachment://chart.png")
                            .setTimestamp();

                        eachChannel.send({
                            embeds: [embed],
                            files: [attachment],
                        });
                    });

                    member.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor("RED")
                                .setTitle("Aeolian | AutoMod")
                                .setDescription(
                                    `${author}, you have been timed out from **${guild.name}** for toxicity.`
                                )
                                .addFields(
                                    {
                                        name: "Message: ",
                                        value: `\`\`\`${message}\`\`\``,
                                        inline: true,
                                    },
                                    {
                                        name: "Score: ",
                                        value: `\`\`\`${score}\`\`\``,
                                        inline: true,
                                    }
                                )
                                .setImage("attachment://chart.png")
                                .setTimestamp(),
                        ],
                        files: [attachment],
                    });
                } else if (low === "kick") {
                    message.delete();
                    member.kick("Toxicity Detected");

                    logChannels.forEach((channel) => {
                        const eachChannel = guild.channels.cache.get(channel);

                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("AutoMod | A toxic message has been detected. [KICKED]")
                            .setDescription(
                                `AutoMod has detected a toxic message! The user has been served their set punishment.\n
                            **<:white_small_square:997471945564115014> User**: ${author} | ${author.id}
                            **<:white_small_square:997471945564115014> Channel**: ${message.channel}
                            ㅤ
                            `
                            )
                            .addFields(
                                {
                                    name: "Message: ",
                                    value: `\`\`\`${message}\`\`\``,
                                    inline: true,
                                },
                                {
                                    name: "Score: ",
                                    value: `\`\`\`${score}\`\`\``,
                                    inline: true,
                                }
                            )
                            .setImage("attachment://chart.png")
                            .setTimestamp();

                        eachChannel.send({
                            embeds: [embed],
                            files: [attachment],
                        });
                    });

                    member.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor("RED")
                                .setTitle("Aeolian | AutoMod")
                                .setDescription(
                                    `${author}, you have been kicked from **${guild.name}** for toxicity.`
                                )
                                .addFields(
                                    {
                                        name: "Message: ",
                                        value: `\`\`\`${message}\`\`\``,
                                        inline: true,
                                    },
                                    {
                                        name: "Score: ",
                                        value: `\`\`\`${score}\`\`\``,
                                        inline: true,
                                    }
                                )
                                .setImage("attachment://chart.png")
                                .setTimestamp(),
                        ],
                        files: [attachment],
                    });
                } else if (low === "ban") {
                    message.delete();
                    member.ban({
                        days: 7,
                        reason: "Toxicity Detected",
                    });

                    logChannels.forEach((channel) => {
                        const eachChannel = guild.channels.cache.get(channel);

                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("AutoMod | A toxic message has been detected. [BANNED]")
                            .setDescription(
                                `AutoMod has detected a toxic message! The user has been served their set punishment.\n
                                **<:white_small_square:997471945564115014> User**: ${author} | ${author.id}
                                **<:white_small_square:997471945564115014> Channel**: ${message.channel}
                                ㅤ
                                `
                            )
                            .addFields(
                                {
                                    name: "Message: ",
                                    value: `\`\`\`${message}\`\`\``,
                                    inline: true,
                                },
                                {
                                    name: "Score: ",
                                    value: `\`\`\`${score}\`\`\``,
                                    inline: true,
                                }
                            )
                            .setImage("attachment://chart.png")
                            .setTimestamp();

                        eachChannel.send({
                            embeds: [embed],
                            files: [attachment],
                        });
                    });

                    member.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor("RED")
                                .setTitle("Aeolian | AutoMod")
                                .setDescription(
                                    `${author}, you have been banned from **${guild.name}** for toxicity.`
                                )
                                .addFields(
                                    {
                                        name: "Message: ",
                                        value: `\`\`\`${message}\`\`\``,
                                        inline: true,
                                    },
                                    {
                                        name: "Score: ",
                                        value: `\`\`\`${score}\`\`\``,
                                        inline: true,
                                    }
                                )
                                .setImage("attachment://chart.png")
                                .setTimestamp(),
                        ],
                        files: [attachment],
                    });
                }
            } else if (score > 0.8 && score <= 0.85) {
                if (medium === "delete") {
                    message.delete();

                    logChannels.forEach((channel) => {
                        const eachChannel = guild.channels.cache.get(channel);

                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("AutoMod | A toxic message has been detected. [DELETED]")
                            .setDescription(
                                `AutoMod has detected a toxic message! The user has been served their set punishment.\n
                                 **<:white_small_square:997471945564115014> User**: ${author} | ${author.id}
                                **<:white_small_square:997471945564115014> Channel**: ${message.channel}
                                ㅤ
                                `
                            )
                            .addFields(
                                {
                                    name: "Message: ",
                                    value: `\`\`\`${message}\`\`\``,
                                    inline: true,
                                },
                                {
                                    name: "Score: ",
                                    value: `\`\`\`${score}\`\`\``,
                                    inline: true,
                                }
                            )
                            .setImage("attachment://chart.png")
                            .setTimestamp();

                        eachChannel.send({
                            embeds: [embed],
                            files: [attachment],
                        });
                    });
                } else if (medium === "timeout") {
                    message.delete();
                    member.timeout(
                        5 * 60000, // 5 minutes
                        "Toxicity Detected"
                    );

                    logChannels.forEach((channel) => {
                        const eachChannel = guild.channels.cache.get(channel);

                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("AutoMod | A toxic message has been detected. [TIMEOUT]")
                            .setDescription(
                                `AutoMod has detected a toxic message! The user has been served their set punishment.\n
                                **<:white_small_square:997471945564115014> User**: ${author} | ${author.id}
                                **<:white_small_square:997471945564115014> Channel**: ${message.channel}
                                ㅤ
                                `
                            )
                            .addFields(
                                {
                                    name: "Message: ",
                                    value: `\`\`\`${message}\`\`\``,
                                    inline: true,
                                },
                                {
                                    name: "Score: ",
                                    value: `\`\`\`${score}\`\`\``,
                                    inline: true,
                                }
                            )
                            .setImage("attachment://chart.png")
                            .setTimestamp();

                        eachChannel.send({
                            embeds: [embed],
                            files: [attachment],
                        });
                    });

                    member.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor("RED")
                                .setTitle("Aeolian | AutoMod")
                                .setDescription(
                                    `${author}, you have been timed out from **${guild.name}** for toxicity.`
                                )
                                .addFields(
                                    {
                                        name: "Message: ",
                                        value: `\`\`\`${message}\`\`\``,
                                        inline: true,
                                    },
                                    {
                                        name: "Score: ",
                                        value: `\`\`\`${score}\`\`\``,
                                        inline: true,
                                    }
                                )
                                .setImage("attachment://chart.png")
                                .setTimestamp(),
                        ],
                        files: [attachment],
                    });
                } else if (medium === "kick") {
                    message.delete();
                    member.kick("Toxicity Detected");

                    logChannels.forEach((channel) => {
                        const eachChannel = guild.channels.cache.get(channel);

                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("AutoMod | A toxic message has been detected. [KICKED]")
                            .setDescription(
                                `AutoMod has detected a toxic message! The user has been served their set punishment.\n
                                **<:white_small_square:997471945564115014> User**: ${author} | ${author.id}
                                **<:white_small_square:997471945564115014> Channel**: ${message.channel}
                            ㅤ
                            `
                            )
                            .addFields(
                                {
                                    name: "Message: ",
                                    value: `\`\`\`${message}\`\`\``,
                                    inline: true,
                                },
                                {
                                    name: "Score: ",
                                    value: `\`\`\`${score}\`\`\``,
                                    inline: true,
                                }
                            )
                            .setImage("attachment://chart.png")
                            .setTimestamp();

                        eachChannel.send({
                            embeds: [embed],
                            files: [attachment],
                        });
                    });

                    member.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor("RED")
                                .setTitle("Aeolian | AutoMod")
                                .setDescription(
                                    `${author}, you have been kicked from **${guild.name}** for toxicity.`
                                )
                                .addFields(
                                    {
                                        name: "Message: ",
                                        value: `\`\`\`${message}\`\`\``,
                                        inline: true,
                                    },
                                    {
                                        name: "Score: ",
                                        value: `\`\`\`${score}\`\`\``,
                                        inline: true,
                                    }
                                )
                                .setImage("attachment://chart.png")
                                .setTimestamp(),
                        ],
                        files: [attachment],
                    });
                } else if (medium === "ban") {
                    message.delete();
                    member.ban({
                        days: 7,
                        reason: "Toxicity Detected",
                    });

                    logChannels.forEach((channel) => {
                        const eachChannel = guild.channels.cache.get(channel);

                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("AutoMod | A toxic message has been detected. [BANNED]")
                            .setDescription(
                                `AutoMod has detected a toxic message! The user has been served their set punishment.\n
                                **<:white_small_square:997471945564115014> User**: ${author} | ${author.id}
                                **<:white_small_square:997471945564115014> Channel**: ${message.channel}
                                ㅤ
                                `
                            )
                            .addFields(
                                {
                                    name: "Message: ",
                                    value: `\`\`\`${message}\`\`\``,
                                    inline: true,
                                },
                                {
                                    name: "Score: ",
                                    value: `\`\`\`${score}\`\`\``,
                                    inline: true,
                                }
                            )
                            .setImage("attachment://chart.png")
                            .setTimestamp();

                        eachChannel.send({
                            embeds: [embed],
                            files: [attachment],
                        });
                    });

                    member.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor("RED")
                                .setTitle("Aeolian | AutoMod")
                                .setDescription(
                                    `${author}, you have been banned from **${guild.name}** for toxicity.`
                                )
                                .addFields(
                                    {
                                        name: "Message: ",
                                        value: `\`\`\`${message}\`\`\``,
                                        inline: true,
                                    },
                                    {
                                        name: "Score: ",
                                        value: `\`\`\`${score}\`\`\``,
                                        inline: true,
                                    }
                                )
                                .setImage("attachment://chart.png")
                                .setTimestamp(),
                        ],
                        files: [attachment],
                    });
                }
            } else if (score > 0.85 && score >= 0.9) {
                if (high === "delete") {
                    message.delete();

                    logChannels.forEach((channel) => {
                        const eachChannel = guild.channels.cache.get(channel);

                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("AutoMod | A toxic message has been detected. [DELETED]")
                            .setDescription(
                                `AutoMod has detected a toxic message! The user has been served their set punishment.\n
                                 **<:white_small_square:997471945564115014> User**: ${author} | ${author.id}
                                **<:white_small_square:997471945564115014> Channel**: ${message.channel}
                                ㅤ
                                `
                            )
                            .addFields(
                                {
                                    name: "Message: ",
                                    value: `\`\`\`${message}\`\`\``,
                                    inline: true,
                                },
                                {
                                    name: "Score: ",
                                    value: `\`\`\`${score}\`\`\``,
                                    inline: true,
                                }
                            )
                            .setImage("attachment://chart.png")
                            .setTimestamp();

                        eachChannel.send({
                            embeds: [embed],
                            files: [attachment],
                        });
                    });
                } else if (high === "timeout") {
                    message.delete();
                    member.timeout(
                        5 * 60000, // 5 minutes
                        "Toxicity Detected"
                    );

                    logChannels.forEach((channel) => {
                        const eachChannel = guild.channels.cache.get(channel);

                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("AutoMod | A toxic message has been detected. [TIMEOUT]")
                            .setDescription(
                                `AutoMod has detected a toxic message! The user has been served their set punishment.\n
                                **<:white_small_square:997471945564115014> User**: ${author} | ${author.id}
                                **<:white_small_square:997471945564115014> Channel**: ${message.channel}
                                ㅤ
                                `
                            )
                            .addFields(
                                {
                                    name: "Message: ",
                                    value: `\`\`\`${message}\`\`\``,
                                    inline: true,
                                },
                                {
                                    name: "Score: ",
                                    value: `\`\`\`${score}\`\`\``,
                                    inline: true,
                                }
                            )
                            .setImage("attachment://chart.png")
                            .setTimestamp();

                        eachChannel.send({
                            embeds: [embed],
                            files: [attachment],
                        });
                    });

                    member.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor("RED")
                                .setTitle("Aeolian | AutoMod")
                                .setDescription(
                                    `${author}, you have been timed out from **${guild.name}** for toxicity.`
                                )
                                .addFields(
                                    {
                                        name: "Message: ",
                                        value: `\`\`\`${message}\`\`\``,
                                        inline: true,
                                    },
                                    {
                                        name: "Score: ",
                                        value: `\`\`\`${score}\`\`\``,
                                        inline: true,
                                    }
                                )
                                .setImage("attachment://chart.png")
                                .setTimestamp(),
                        ],
                        files: [attachment],
                    });
                } else if (high === "kick") {
                    message.delete();
                    member.kick("Toxicity Detected");

                    logChannels.forEach((channel) => {
                        const eachChannel = guild.channels.cache.get(channel);

                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("AutoMod | A toxic message has been detected. [KICKED]")
                            .setDescription(
                                `AutoMod has detected a toxic message! The user has been served their set punishment.\n
                                **<:white_small_square:997471945564115014> User**: ${author} | ${author.id}
                                **<:white_small_square:997471945564115014> Channel**: ${message.channel}
                            ㅤ
                            `
                            )
                            .addFields(
                                {
                                    name: "Message: ",
                                    value: `\`\`\`${message}\`\`\``,
                                    inline: true,
                                },
                                {
                                    name: "Score: ",
                                    value: `\`\`\`${score}\`\`\``,
                                    inline: true,
                                }
                            )
                            .setImage("attachment://chart.png")
                            .setTimestamp();

                        eachChannel.send({
                            embeds: [embed],
                            files: [attachment],
                        });
                    });

                    member.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor("RED")
                                .setTitle("Aeolian | AutoMod")
                                .setDescription(
                                    `${author}, you have been kicked from **${guild.name}** for toxicity.`
                                )
                                .addFields(
                                    {
                                        name: "Message: ",
                                        value: `\`\`\`${message}\`\`\``,
                                        inline: true,
                                    },
                                    {
                                        name: "Score: ",
                                        value: `\`\`\`${score}\`\`\``,
                                        inline: true,
                                    }
                                )
                                .setImage("attachment://chart.png")
                                .setTimestamp(),
                        ],
                        files: [attachment],
                    });
                } else if (high === "ban") {
                    message.delete();
                    member.ban({
                        days: 7,
                        reason: "Toxicity Detected",
                    });

                    logChannels.forEach((channel) => {
                        const eachChannel = guild.channels.cache.get(channel);

                        const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("AutoMod | A toxic message has been detected. [BANNED]")
                            .setDescription(
                                `AutoMod has detected a toxic message! The user has been served their set punishment.\n
                                **<:white_small_square:997471945564115014> User**: ${author} | ${author.id}
                                **<:white_small_square:997471945564115014> Channel**: ${message.channel}
                                ㅤ
                                `
                            )
                            .addFields(
                                {
                                    name: "Message: ",
                                    value: `\`\`\`${message}\`\`\``,
                                    inline: true,
                                },
                                {
                                    name: "Score: ",
                                    value: `\`\`\`${score}\`\`\``,
                                    inline: true,
                                }
                            )
                            .setImage("attachment://chart.png")
                            .setTimestamp();

                        eachChannel.send({
                            embeds: [embed],
                            files: [attachment],
                        });
                    });

                    member.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor("RED")
                                .setTitle("Aeolian | AutoMod")
                                .setDescription(
                                    `${author}, you have been banned from **${guild.name}** for toxicity.`
                                )
                                .addFields(
                                    {
                                        name: "Message: ",
                                        value: `\`\`\`${message}\`\`\``,
                                        inline: true,
                                    },
                                    {
                                        name: "Score: ",
                                        value: `\`\`\`${score}\`\`\``,
                                        inline: true,
                                    }
                                )
                                .setImage("attachment://chart.png")
                                .setTimestamp(),
                        ],
                        files: [attachment],
                    });
                }
            }
        } else {
            return;
        }
    },
};
