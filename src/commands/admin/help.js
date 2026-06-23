const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Wyświetla listę dostępnych komend.'),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor('#00c8ff')
            .setTitle('📘 Lista komend')
            .setDescription('Oto wszystkie dostępne komendy na serwerze:')
            .addFields(
                {
                    name: '🛠️ Administracyjne',
                    value:
                    `• **/ban** – banuje użytkownika  
                     • **/unban** – odbanowuje użytkownika  
                     • **/kick** – wyrzuca użytkownika  
                     • **/mute** – wycisza użytkownika  
                     • **/clear** – usuwa wiadomości`
                },
                {
                    name: 'ℹ️ Informacyjne',
                    value:
                    `• **/help** – wyświetla tę listę`
                }
            )
            .setFooter({ text: 'Bot by afeee' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
