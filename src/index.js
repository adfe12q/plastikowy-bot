require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

// ŁADOWANIE KOMEND
const commandsPath = path.join(__dirname, 'commands');
for (const folder of fs.readdirSync(commandsPath)) {
    const folderPath = path.join(commandsPath, folder);
    for (const file of fs.readdirSync(folderPath)) {
        if (file.endsWith('.js')) {
            const command = require(path.join(folderPath, file));
            client.commands.set(command.data.name, command);
        }
    }
}

client.once('ready', () => {
    console.log(`Bot zalogowany jako ${client.user.tag}`);
});

// OBSŁUGA KOMEND
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: 'Wystąpił błąd przy wykonywaniu komendy.', ephemeral: true });
    }
});

client.login(process.env.TOKEN);
