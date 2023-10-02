import { Client, GatewayIntentBits } from 'discord.js';
import dotEnv from "dotenv"
// const dotEnv = require('dotenv');
dotEnv.config();
const client = new Client({ intents: [GatewayIntentBits.Guilds , GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

client.on('messageCreate',(message)=>{
    if(message.author.bot) {
        
        return;}  
    message.reply({
        content : "Hello there we are working on our project"
    })
    console.log(message.content);
});

client.on("interactionCreate",(intraction)=>{
        intraction.reply("its easy..")
})

client.login(process.env.SECREAT_AUTH);