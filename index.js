// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';




// const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// import {mongoose} from 'mongoose';
import { updateStreak, createNewUser, createNewCompitation, eligibleUsers } from './mongoDb.js'; // Import the storeMessageData function


import dotEnv from "dotenv"

dotEnv.config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.on("ready", c => {
    console.log(`Ready! Logged in as ${c.user.tag}`,

    );

});

// (async()=>{
//     mongoose.set('strictQuery', false);
//     await mongoose.connect('mongoURL'); // write mongo yrl here
//     console.log("mono connected");

//     client.on('messageCreate', message => {

//     if (message.author.bot) return; 

//     const githubUrlRegex = /(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+/;

//     // Check if the message content matches the GitHub URL pattern
//     if (githubUrlRegex.test(message.content)) {
//         message.reply('you saved your streak ');
//     }
//     else{
//         message.reply(`${message.author.displayName} please send the github url too`);
//     }

//     // if (message.content === '!ping') {
//     //     message.channel.send('Pong!');
//     // }
//     // else{message.reply(`hello there ${message.author.displayName}`  );}

//     // console.log(`Received message: ${message}`);


// });
// })()


async function contest(contestInfo) {
    await createNewCompitation(contestInfo);
}



// Main----------------------------------------------------------------------------------------------------------->>
client.on('messageCreate', async (message) => {
    // Store message data in the database
    if (message.author.bot) return;

    // if (message.content.length >= 20) {
    //     let data = await storeMessageData(message.author.id);
    //     console.log(data);
    //     message.reply(`${message.author.globalName} ${data}`)
    // }
    // else {
    //     message.reply(`${message.author.globalName} plase send more information about your project so we can update your strek info`);
    // }


    // Checkthe user sent the command "reg!ster"
    if (message.content.toLowerCase() === 'reg!ster') {
        //Check user info first
        let data = await createNewUser(message.author.id, message.author.username);

        if (data === "registerdNow") {
            // Send a registration confirmation message

            const registrationEmbed = new EmbedBuilder()
                .setColor('#00ff00') // Green color
                .setTitle('Registration Confirmation')
                .setDescription(`Welcome, ${message.author.username}! You are now registered.`);

            // Send the registration confirmation message
            await message.channel.send({ embeds: [registrationEmbed] });
        }
        else {

            const registrationEmbed = new EmbedBuilder()
                .setColor('#ff0000') // red color
                .setTitle('Registration Confirmation')
                .setDescription(`He, ${message.author.username}! You are already registered.`);

            // Send the registration already completed message
            await message.channel.send({ embeds: [registrationEmbed] });

        }



    }


    //Update Daily Task Command "update!t"
    if (message.content.toLowerCase() === 'update!t') {
        //Check user info first
        let data = await updateStreak(message.author.id);
        // If user not there
        if (data === "notRegistered") {
            const registrationEmbed = new EmbedBuilder()
                .setColor('#ffff00') // Yello color
                .setTitle('Update Failed')
                .setDescription(`Sorry, ${message.author.username}, you are not registered. Please register first.`)
                // .addFields([{ name: '\u100B', value: '\u100B',inline:"flase" },])
                .addFields([{ name: 'How to Register', value: 'To register, use ---->> `reg!ster`.' },]);

            // Send the registration confirmation message
            await message.channel.send({ embeds: [registrationEmbed] });
        }
        else {
            if (data.status === "updated") {
                const successEmbed = new EmbedBuilder()
                    .setColor('#00ff00') // Green color for success
                    .setTitle('Update Successful')
                    .setDescription(`Congratulations, ${message.author.username}! You are updated on time. Your information has been successfully updated.\n`)
                    // .addFields([{name: '\u100B', value: '\u100B' },])
                    .setTitle('Streak Information')
                    .addFields([{ name: 'Streak  ---->', value: `${data.streak}` },]);

                // Send the success message
                await message.channel.send({ embeds: [successEmbed] });

            }
            else if (data.status === "alreadyUpdated") {
                const alredyUptodateEmbed = new EmbedBuilder()
                    .setColor('#00ff00') // Green color for success
                    .setTitle('Already Updated')
                    .setDescription(`He, ${message.author.username}! You are already updated .\n`)
                    // .addFields([{name: '\u100B', value: '\u100B' }])
                    .setTitle('Streak Information')
                    .addFields([{ name: 'Streak  ---->', value: `${data.streak}` },]);

                // Send the success message
                await message.channel.send({ embeds: [alredyUptodateEmbed] });
            }
            else if (data.status === "lateUpdate") {
                // If the user is late, send a message indicating they are updated but late
                const lateUpdateEmbed = new EmbedBuilder()
                    .setColor('#ffcc00') // Yellow color for warning
                    .setTitle('Late Update')
                    .setDescription(`Hello, ${message.author.username}. You have updated your information, but you are late. Please make sure to update on time next time.\n`)
                    // .addFields([{name: '\u200B', value: '\u200B' }])
                    .setTitle('Streak Information')
                    .addFields([{ name: 'Streak  ---->', value: `    ${data.streak}` },]);
                // Send the late update message
                await message.channel.send({ embeds: [lateUpdateEmbed] });

            }
        }
    }


    if (message.content.toLowerCase() === "!contwinners") {
        let users = await eligibleUsers();

        if (users == "noOneEligible") {
            const userinfo = new EmbedBuilder()
                .setColor('#ffff00') // Yello color
                .setTitle('Eligible Contestant')
                .setDescription(`Best of luck for next time All...`)
                .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYa_R8DCUXFpISmQ-jDkDdp7BCD9wd-lxzoid5ObTQXw&s')

            await message.channel.send({ embeds: [userinfo] });
        } else {
            const userinfo = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Eligible Contestant')
                .addFields(users.map(user => ({ name: user.name, value: `${user.streak}`, inline: true })))
                .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFcudUoB3T7YbSEpu8ktGkE_XHDKruRk162g&usqp=CAU')
                .setTimestamp()
                .setFooter({ text: 'Congrtulations All', iconURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFcudUoB3T7YbSEpu8ktGkE_XHDKruRk162g&usqp=CAU' })

            // .addFields([{ name: '\u100B', value: '\u100B',inline:"flase" },])
            // .addFields([{ name: 'How to Register', value: 'To register, use ---->> `reg!ster`.' },]);

            await message.channel.send({ embeds: [userinfo] });
        }
    }

    if (message.content.toLowerCase() === '!createcontest') {
        const userId = message.author.id;
        const contestData = {};

        // Ask for contest name
        await message.channel.send('Please enter the contest name:');
        const nameFilter = m => m.author.id === userId;
        const nameCollector = message.channel.createMessageCollector({
            filter: nameFilter,
            time: 60000,
        });

        nameCollector.on('collect', m => {
            contestData.name = m.content;

            // Ask for contest start date
            m.channel.send('Please enter the contest start date (YYYY-MM-DD):');
            nameCollector.stop();
        });

        nameCollector.on('end', () => {
            const dateFilter = m => m.author.id === userId;
            const dateCollector = message.channel.createMessageCollector({
                filter: dateFilter,
                time: 60000,
            });

            dateCollector.on('collect', m => {
                const startDate = new Date(m.content);
                if (!isNaN(startDate.getTime())) {
                    contestData.startDate = startDate;

                    // Ask for contest duration in days
                    m.channel.send('Please enter the number of days for the contest:');
                    dateCollector.stop();
                } else {
                    m.channel.send('Invalid date format. Please use YYYY-MM-DD.');
                }
            });

            dateCollector.on('end', () => {
                const daysFilter = m => m.author.id === userId;
                const daysCollector = message.channel.createMessageCollector({
                    filter: daysFilter,
                    time: 60000,
                });

                daysCollector.on('collect', m => {
                    const days = parseInt(m.content);
                    if (!isNaN(days) && days > 0) {
                        contestData.durationDays = days;

                        // Send an embedded message with contest details
                        const embed = new EmbedBuilder()
                            .setTitle('Contest Details')
                            .addFields({ name: 'Name', value: `${contestData.name}` },)
                            .addFields({ name: 'Start Date', value: `${contestData.startDate.toDateString()}` })
                            .addFields({ name: 'Duration (in days)', value: `${contestData.durationDays}` });
                        m.channel.send({ embeds: [embed] });
                    } else {
                        m.channel.send('Invalid input. Please enter a valid number of days.');
                    }

                    daysCollector.stop(); console.log(contestData)
                });
            });
        });
    }
});


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'createcontest') {
        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId('myModal')
            .setTitle('Contest');

        // Add components to modal

        // Create the text input components
        const contestName = new TextInputBuilder()
            .setCustomId('contestName')

            .setLabel("Contest Name :")

            .setStyle(TextInputStyle.Short);

        const contestDate = new TextInputBuilder()
            .setCustomId('contestDate')
            .setLabel("Contest Starting Date : (YYYY-MM-DD)")

            .setStyle(TextInputStyle.Short);

        const contestPeriod = new TextInputBuilder()
            .setCustomId('contestPeriod')
            .setLabel("Number of days :")

            .setStyle(TextInputStyle.Short);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(contestName);
        const secondActionRow = new ActionRowBuilder().addComponents(contestDate);
        const thirdActionRow = new ActionRowBuilder().addComponents(contestPeriod);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);

        const filter = (interaction) => interaction.customId === `myModal`;

        interaction
            .awaitModalSubmit({ filter, time: 30_000 })
            .then((modalInteraction) => {
                const name = modalInteraction.fields.getTextInputValue('contestName');
                const date = modalInteraction.fields.getTextInputValue('contestDate');
                const days = modalInteraction.fields.getTextInputValue('contestPeriod');

                let data = { contestName: name, startDate: date, days: days };
                console.log(data);
                modalInteraction.reply("Done ");
                contest(data).then(() => { })


            })
    }
});









client.login(process.env.SECREAT_AUTH);