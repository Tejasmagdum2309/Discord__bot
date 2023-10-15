# Discord__bot

ContestBot is a Discord bot designed to automate hackathons and competitions. It helps participants update their daily tasks, maintains their streak, and ensures eligibility for certificates. Additionally, it provides commands for creating contests, registration, and announcing winners.

## Features

- **Daily Task Updates:** Participants can update their daily tasks by sending a specific message. Failure to update tasks for a day results in disqualification.

- **Streak Maintenance:** ContestBot keeps track of participants' daily updates, maintaining their streaks.

- **Contest Management:**
  - `/createcontest`: Create a new contest.
  - `reg!ster`: Register for the ongoing contest.
  - `update!t`: Update daily tasks.
  - `!contwinners`: List eligible users for the contest.

## Getting Started

To use ContestBot in your Discord server, follow these steps:

### Prerequisites

- Node.js installed on your system.

### Installation

1. Clone the repository: 

git clone https://github.com/Tejasmagdum2309/Discord__bot

2. Navigate to the project directory:

cd Discord-Bot

3. Install dependencies:

The following npm packages are required for this project:

"dependencies": {
"@discordjs/builders": "^1.6.5",
"@discordjs/rest": "^2.0.1",
"discord-api-types": "^0.37.60",
"discord.js": "^14.13.0",
"dotenv": "^16.3.1",
"mongodb": "^6.1.0",
"node-cron": "^3.0.2",
"nodemon": "^3.0.1"
}

4. Configure your Discord bot token and other settings in `config.json`.

there is env file just paste yor monodburl and bot key.


## Contact

If you have any questions or suggestions, feel free to reach out:

- Email: magdumtej1008@gmail.com
- Discord: seven06767
- GitHub: [Tejasmagdum2309](https://github.com/Tejasmagdum2309)