const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {

        const channelId = "1502460958122184704"; // ← TWOJE ID KANAŁU

        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor('#00ff9d')
            .setTitle('👋 Nowy użytkownik na serwerze!')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(
                `Witaj **${member.user.username}**!\n` +
                `Cieszymy się, że dołączyłeś do **${member.guild.name}**.`
            )
            .addFields(
                {
                    name: '📅 Konto utworzone',
                    value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`,
                    inline: true
                },
                {
                    name: '👥 Liczba członków',
                    value: `${member.guild.memberCount}`,
                    inline: true
                }
            )
            .setFooter({ text: 'Miłego pobytu na serwerze!' })
            .setTimestamp();

        channel.send({ embeds: [embed] });
    }
};
