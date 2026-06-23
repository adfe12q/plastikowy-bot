const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {

        const channelId = "ID_KANAŁU_POWITALNEGO";

        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) return;

        channel.send(
            `👋 Siema **${member.user.username}**!  
Dołączyłeś do **${member.guild.name}**. Rozgość się!`
        );
    }
};
