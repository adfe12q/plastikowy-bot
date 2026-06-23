const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Usuwa określoną liczbę wiadomości z kanału.')
        .addIntegerOption(option =>
            option.setName('ilość')
                .setDescription('Ile wiadomości usunąć (1-100)')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('ilość');

        if (amount < 1 || amount > 100) {
            return interaction.reply({
                content: 'Podaj liczbę od 1 do 100.',
                ephemeral: true
            });
        }

        const channel = interaction.channel;

        try {
            const deleted = await channel.bulkDelete(amount, true);

            await interaction.reply({
                content: `🧹 Usunięto **${deleted.size}** wiadomości.`,
                ephemeral: true
            });
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: 'Nie mogę usunąć wiadomości starszych niż 14 dni.',
                ephemeral: true
            });
        }
    }
};
