require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

client.commands = new Collection();


// =========================
// ŁADOWANIE KOMEND
// =========================
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


// =========================
// ŁADOWANIE EVENTÓW
// =========================
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}


// =========================
// BOT GOTOWY
// =========================
client.once('ready', () => {
    console.log(`Bot zalogowany jako ${client.user.tag}`);
});


// =========================
// OBSŁUGA KOMEND (POPRAWIONA)
// =========================
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);

        // 🔥 ZABEZPIECZENIE PRZED CRASHEM
        if (interaction.deferred || interaction.replied) {
            await interaction.followUp({
                content: 'Wystąpił błąd przy wykonywaniu komendy.',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: 'Wystąpił błąd przy wykonywaniu komendy.',
                ephemeral: true
            });
        }
    }
});


client.login(process.env.TOKEN);
