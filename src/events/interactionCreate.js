const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        // Obsługa komend slash
        if (interaction.isChatInputCommand()) {
            const commandName = interaction.commandName;

            try {
                // Szukamy komendy w folderze commands
                const commandsPath = path.join(__dirname, '../commands');
                const command = findCommand(commandsPath, commandName);

                if (!command) {
                    return interaction.reply({
                        content: '❌ Ta komenda nie istnieje.',
                        ephemeral: true
                    });
                }

                await command.execute(interaction);

            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: '❌ Wystąpił błąd podczas wykonywania komendy.',
                    ephemeral: true
                });
            }
        }

        // Obsługa buttonów
        if (interaction.isButton()) {
            console.log(`Kliknięto button: ${interaction.customId}`);
            // tu dodamy ticket, giveaway, boost menu jeśli będziesz chciał
        }

        // Obsługa select menu
        if (interaction.isStringSelectMenu()) {
            console.log(`Select menu: ${interaction.customId}`);
            // tu też dodamy obsługę jak będziesz chciał
        }
    }
};

// Funkcja do wyszukiwania komend w podfolderach
function findCommand(dir, name) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
            const found = findCommand(fullPath, name);
            if (found) return found;
        } else if (file.endsWith('.js')) {
            const command = require(fullPath);
            if (command.data && command.data.name === name) {
                return command;
            }
        }
    }

    return null;
}
