// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits } from 'discord.js';
// import {mongoose} from 'mongoose';
import { storeMessageData } from './mongoDb.js'; // Import the storeMessageData function


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



// client.on('messageCreate',message =>{
//     console.log(message);
// })




// Log in to Discord with your client's token


client.on('messageCreate', async (message) => {
    // Store message data in the database
    if (message.author.bot) return;

    if (message.content.length >= 20) {
        let data = await storeMessageData(message.author.id);
        console.log(data);
        message.reply(`${message.author.globalName} ${data}`)
    }
    else {
        message.reply(`${message.author.globalName} plase send more information about your project so we can update your strek info`);
    }






});

client.login(process.env.SECREAT_AUTH);