import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'ping',
    description: 'we r trying somthing new...',
  },
];

const rest = new REST({ version: '10' }).setToken("MTE1ODA3MjE1MjgzMTA0NTcwMg.G-GJL9.GlS_Q86Q4xE-bmhnEDts0ioIqn8canAxt0xzgc");

try {
    console.log('Started refreshing application (/) commands.');
  
    await rest.put(Routes.applicationCommands("1158072152831045702"), { body: commands });
  
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }