const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Odbanowuje użytkownika po ID.')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID użytkownika do odbanowania')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const userId = interaction.options.getString('id');

        try {
            await interaction.guild.members.unban(userId);

            await interaction.reply(`🔓 Użytkownik o ID **${userId}** został odbanowany.`);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `❌ Nie udało się odbanować użytkownika. Sprawdź, czy ID jest poprawne.`,
                ephemeral: true
            });
        }
    }
};
