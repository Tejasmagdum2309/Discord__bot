import { REST, Routes } from 'discord.js';
import dotEnv from "dotenv"
dotEnv.config();


const commands = [
  {
    name: 'createcontest',
    description: 'Eligible users!',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.SECREAT_AUTH);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands("1158072152831045702"), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}