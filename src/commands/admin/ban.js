const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banuje użytkownika.')
        .addUserOption(option =>
            option.setName('użytkownik')
                .setDescription('Kogo zbanować')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('powód')
                .setDescription('Powód bana')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('użytkownik');
        const reason = interaction.options.getString('powód') || 'Brak powodu';

        const member = await interaction.guild.members.fetch(user.id);

        await member.ban({ reason });

        await interaction.reply(`🔨 Użytkownik **${user.tag}** został zbanowany.\nPowód: **${reason}**`);
    }
};
