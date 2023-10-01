import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds , GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

client.on('messageCreate',(message)=>{
    if(message.author.bot) {
        
        return;}  
    message.reply({
        content : "Hello there we are working on our project"
    })
    // console.log(message.content);
});

client.on("interactionCreate",(intraction)=>{
        intraction.reply("its easy..")
})

client.login("MTE1ODA3MjE1MjgzMTA0NTcwMg.G-GJL9.GlS_Q86Q4xE-bmhnEDts0ioIqn8canAxt0xzgc");