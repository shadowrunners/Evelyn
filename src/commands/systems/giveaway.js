const { CommandInteraction, EmbedBuilder, Client } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'giveaway',
    description: 'A complete giveaway system.',
    permissions: 'ADMINISTRATOR',
    public: true,
    options: [
        {
            name: 'start',
            description: 'Start a giveaway.',
            type: 1,
            options: [
                {
                    name: 'duration',
                    description: 'Provide a duration for this giveaway. (1m, 1h, 1d)',
                    type: 3,
                    required: true
                },
                {
                    name: 'winners',
                    description: 'Select the amount of winners for this giveaway.',
                    type: 4,
                    required: true
                },
                {
                    name: 'prize',
                    description: 'Provide the name of the prize.',
                    type: 3,
                    required: true
                },
                {
                    name: 'channel',
                    description: 'Select a channel to send the giveaway to.',
                    type: 7,
                    channelTypes: ['GUILD_TEXT']
                }
            ]
        },
        {
            name: 'actions',
            description: 'Options for giveaways.',
            type: 1,
            options: [
                {
                    name: 'options',
                    description: 'Select an option.',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'end',
                            value: 'end'
                        },
                        {
                            name: 'pause',
                            value: 'pause'
                        },
                        {
                            name: 'unpause',
                            value: 'unpause'
                        },
                        {
                            name: 'reroll',
                            value: 'reroll'
                        },
                        {
                            name: 'delete',
                            value: 'delete'
                        },
                    ]
                },
                {
                    name: 'message-id',
                    description: 'Provide the message ID of the giveaway.',
                    type: 3,
                    required: true
                }
            ]
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const { options } = interaction;

        const Sub = options.getSubcommand();

        const ErrorEmbed = new EmbedBuilder()
        .setColor('RED');

        const SuccessEmbed = new EmbedBuilder()
        .setColor('GREEN');

        const successEmbed = new EmbedBuilder()
        .setColor('GREEN')

        const errorEmbed = new EmbedBuilder()
        .setColor('RED')

        switch(Sub) {
            case 'start': {
                const gChannel = options.getChannel('channel') || interaction.channel;
                const duration = options.getString('duration');
                const winnerCount = options.getInteger('winners');
                const prize = options.getString('prize');

                client.giveawaysManager.start(gChannel, {
                    duration: ms(duration),
                    winnerCount,
                    prize,
                    messages: {
                        giveaway: '🎉 **A wild giveaway has started!** 🎉',
                        giveawayEnded: '🎉 **This giveaway has ended, thank you for participating!** 🎉',
                        winMessage: '🎉 Congratulations, {winners}! You won **{this.prize}**! 🎉'
                    }
                }).then(async () => {
                    SuccessEmbed.setDescription('🎉 Giveaway was successfully started. 🎉')
                    return interaction.reply({embeds: [SuccessEmbed], ephemeral: true});
                }).catch((err) => {
                    ErrorEmbed.setDescription(`🎉 An error has occurred\n\`${err}\` 🎉`)
                    return interaction.reply({embeds: [ErrorEmbed], ephemeral: true});
                });
            }
            break;

            case 'actions': {
                const choice = options.getString('options');
                const messageId = options.getString('message-id');
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);

                if (!giveaway) {
                    ErrorEmbed.setDescription(`🎉 Unable to find the giveaway with the message ID: ${messageId} in this guild.`);
                    return interaction.reply({embeds: [errorEmbed], ephemeral: true});
                }

                switch(choice) {
                    case 'end': {
                        client.giveawaysManager.end(messageId).then(() => {
                            successEmbed.setDescription('🎉 Giveaway has been ended. 🎉');
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            ErrorEmbed.setDescription(`🎉 An error has occurred\n\`${err}\` 🎉`)
                            return interaction.reply({embeds: [ErrorEmbed], ephemeral: true});
                        });
                    }
                    break;

                    case 'pause': {
                        client.giveawaysManager.pause(messageId).then(() => {
                            successEmbed.setDescription('🎉 Giveaway has been paused. 🎉');
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            ErrorEmbed.setDescription(`🎉 An error has occurred\n\`${err}\` 🎉`)
                            return interaction.reply({embeds: [ErrorEmbed], ephemeral: true});
                        });
                    }
                    break;
                    
                    case 'unpause': {
                        client.giveawaysManager.unpause(messageId).then(() => {
                            successEmbed.setDescription('🎉 Giveaway has been unpaused. 🎉');
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            ErrorEmbed.setDescription(`🎉 An error has occurred\n\`${err}\` 🎉`)
                            return interaction.reply({embeds: [ErrorEmbed], ephemeral: true});
                        });
                    }
                    break;
                    
                    case 'reroll': {
                        client.giveawaysManager.reroll(messageId).then(() => {
                            successEmbed.setDescription('🎉 Giveaway has been rerolled. 🎉');
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            ErrorEmbed.setDescription(`🎉 An error has occurred\n\`${err}\` 🎉`)
                            return interaction.reply({embeds: [ErrorEmbed], ephemeral: true});
                        });
                    }
                    break;
                    
                    case 'delete': {
                        client.giveawaysManager.delete(messageId).then(() => {
                            successEmbed.setDescription('🎉 Giveaway has been deleted. 🎉');
                            return interaction.reply({embeds: [successEmbed], ephemeral: true});
                        }).catch((err) => {
                            ErrorEmbed.setDescription(`🎉 An error has occurred\n\`${err}\` 🎉`)
                            return interaction.reply({embeds: [ErrorEmbed], ephemeral: true});
                        });
                    }
                    break;
                }
            }
            break;

            default: {
                console.log('An error has occured in the giveaway system.')
            }
        }
    }
}