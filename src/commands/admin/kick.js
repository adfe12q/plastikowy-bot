const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Wyrzuca użytkownika z serwera.')
        .addUserOption(option =>
            option.setName('użytkownik')
                .setDescription('Kogo wyrzucić')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('powód')
                .setDescription('Powód wyrzucenia')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('użytkownik');
        const reason = interaction.options.getString('powód') || 'Brak powodu';

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({
                content: 'Nie mogę znaleźć tego użytkownika na serwerze.',
                ephemeral: true
            });
        }

        // Sprawdzenie hierarchii ról
        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({
                content: 'Nie możesz wyrzucić osoby z wyższą lub równą rolą.',
                ephemeral: true
            });
        }

        // Sprawdzenie czy bot może wyrzucić
        if (!member.kickable) {
            return interaction.reply({
                content: 'Nie mogę wyrzucić tego użytkownika (rola wyżej niż bot).',
                ephemeral: true
            });
        }

        await member.kick(reason);

        await interaction.reply(`👢 Użytkownik **${user.tag}** został wyrzucony.\nPowód: **${reason}**`);
    }
};
