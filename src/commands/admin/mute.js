const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Wycisza użytkownika na określony czas.')
        .addUserOption(option =>
            option.setName('użytkownik')
                .setDescription('Kogo wyciszyć')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('czas')
                .setDescription('Czas w minutach')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('powód')
                .setDescription('Powód wyciszenia')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('użytkownik');
        const minutes = interaction.options.getInteger('czas');
        const reason = interaction.options.getString('powód') || 'Brak powodu';

        const member = await interaction.guild.members.fetch(user.id);

        if (!member) {
            return interaction.reply({
                content: '❌ Nie mogę znaleźć tego użytkownika.',
                ephemeral: true
            });
        }

        if (!member.moderatable) {
            return interaction.reply({
                content: '❌ Nie mogę wyciszyć tego użytkownika (rola wyżej?).',
                ephemeral: true
            });
        }

        const ms = minutes * 60 * 1000;

        try {
            await member.timeout(ms, reason);

            await interaction.reply(
                `🔇 Użytkownik **${user.tag}** został wyciszony na **${minutes} minut**.\nPowód: **${reason}**`
            );
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ Wystąpił błąd podczas wyciszania użytkownika.',
                ephemeral: true
            });
        }
    }
};
