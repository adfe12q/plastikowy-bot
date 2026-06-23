const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {

        const channelId = "1502460979177459723";

        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) return;

        channel.send(
            `👋 **${member.user.username}** opuścił serwer.  
Szkoda, może jeszcze wróci.`
        );
    }
};
