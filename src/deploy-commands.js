const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const commands = [];

const commandsPath = path.join(__dirname, 'commands');

function loadCommands(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            loadCommands(fullPath);
        } else if (file.endsWith('.js')) {
            const command = require(fullPath);
            commands.push(command.data.toJSON());
        }
    }
}

loadCommands(commandsPath);

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🔄 Rejestrowanie komend...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('✅ Komendy zarejestrowane!');
    } catch (error) {
        console.error(error);
    }
})();
