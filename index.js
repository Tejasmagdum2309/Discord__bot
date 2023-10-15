import { Client, Events, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { updateStreak, createNewUser, createNewCompitation, eligibleUsers } from './mongoDb.js'; 


import dotEnv from "dotenv"
dotEnv.config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.on("ready", c => {
    console.log(`Ready! Logged in as ${c.user.tag}`,

    );

    const channelId = 'YOUR_CHANNEL_ID';

    // Function to calculate the milliseconds until the next day
    function millisecondsUntilNextDay() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // Set the time to the start of the next day
        return tomorrow - now;
    }

    // Set up an interval to send a message every day at the start of the day
    setInterval(async () => {
        const channel = client.channels.cache.get(channelId);
        if (channel ) {
            const registrationEmbed = new EmbedBuilder()
                .setColor('#00ff00') // Green color
                .setTitle('Registration Confirmation')
                .setDescription(`Welcome, ${message.author.username}! You are now registered.`);

            // Send the registration confirmation message
            await message.channel.send({ embeds: [registrationEmbed] });
        } else {
            console.error('Invalid channel ID or channel is not a text channel.');
        }
    }, millisecondsUntilNextDay());
});



async function contest(contestInfo) {
    await createNewCompitation(contestInfo);
}


client.on('messageCreate', async (message) => {
    // Store message data in the database
    if (message.author.bot) return;



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
                // console.log(data);
                modalInteraction.reply("Registraction Completed");
                contest(data).then(() => { })


            })
    }
});









client.login(process.env.SECREAT_AUTH);