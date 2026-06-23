const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Usuwa wyciszenie (timeout) użytkownika.')
        .addUserOption(option =>
            option.setName('użytkownik')
                .setDescription('Komu zdjąć wyciszenie')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('użytkownik');
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
                content: 'Nie możesz zdjąć wyciszenia osobie z wyższą lub równą rolą.',
                ephemeral: true
            });
        }

        // Sprawdzenie czy bot może moderować
        if (!member.moderatable) {
            return interaction.reply({
                content: 'Nie mogę zdjąć wyciszenia tej osoby (rola wyżej niż bot).',
                ephemeral: true
            });
        }

        // Sprawdzenie czy użytkownik jest w ogóle wyciszony
        if (!member.communicationDisabledUntilTimestamp) {
            return interaction.reply({
                content: 'Ten użytkownik nie jest wyciszony.',
                ephemeral: true
            });
        }

        await member.timeout(null); // usuwa timeout

        await interaction.reply(`🔊 Użytkownik **${user.tag}** został odciszony.`);
    }
};
