const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {

        const channelId = "1502460979177459723"; // ← TWOJE ID KANAŁU POŻEGNALNEGO

        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor('#ff4d4d')
            .setTitle('👋 Użytkownik opuścił serwer')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(
                `**${member.user.username}** opuścił serwer **${member.guild.name}**.`
            )
            .addFields(
                {
                    name: '👥 Aktualna liczba członków',
                    value: `${member.guild.memberCount}`,
                    inline: true
                }
            )
            .setFooter({ text: 'Szkoda, może jeszcze wróci.' })
            .setTimestamp();

        channel.send({ embeds: [embed] });
    }
};
