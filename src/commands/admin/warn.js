const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Daje ostrzeżenie użytkownikowi.')
        .addUserOption(option =>
            option.setName('użytkownik')
                .setDescription('Kto ma dostać ostrzeżenie')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('powód')
                .setDescription('Powód ostrzeżenia')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('użytkownik');
        const reason = interaction.options.getString('powód');

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
                content: 'Nie możesz dać ostrzeżenia osobie z wyższą lub równą rolą.',
                ephemeral: true
            });
        }

        await interaction.reply(`⚠️ Użytkownik **${user.tag}** otrzymał ostrzeżenie.\nPowód: **${reason}**`);
    }
};
