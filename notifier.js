const fs = require('node:fs/promises');
const { EmbedBuilder } = require('discord.js');
const { getPrayerTimes } = require('./prayers.js');

const startNotifier = async (client) => {
    try {
        const file = await fs.readFile('./data/servers.json', 'utf8');
        const data = JSON.parse(file);

        for (const server of data) {

            if (!server.notifications) continue;

            const city = server.city;
            const country = server.country;
            const channelId = server.channelId;

            const channel = await client.channels.fetch(channelId);

            const prayerTimes = await getPrayerTimes(city, country);
            const timezone = prayerTimes.timezone;

            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            const currentTime = formatter.formatToParts(new Date());

            const currentHrs = Number(
                currentTime.find(part => part.type === 'hour').value
            );

            const currentMin = Number(
                currentTime.find(part => part.type === 'minute').value
            );

            const timings = prayerTimes.timings;

            const hrs = timings.map(element =>
                parseInt(element[1].split(':')[0])
            );

            const min = timings.map(element =>
                parseInt(element[1].split(':')[1])
            );

            let prayerName;
            let prayerDescription;

            switch (true) {
                case currentHrs === hrs[0] && currentMin === min[0]:
                    prayerName = 'Fajr Prayer';
                    prayerDescription = '🌄 Time for Fajr!';
                    break;

                case currentHrs === hrs[2] && currentMin === min[2]:
                    prayerName = 'Dhuhr Prayer';
                    prayerDescription = '☀️ Time for Dhuhr!';
                    break;

                case currentHrs === hrs[3] && currentMin === min[3]:
                    prayerName = 'Asr Prayer';
                    prayerDescription = '☀️ Time for Asr!';
                    break;

                case currentHrs === hrs[5] && currentMin === min[5]:
                    prayerName = 'Maghrib Prayer';
                    prayerDescription = '🌆 Time for Maghrib!';
                    break;

                case currentHrs === hrs[6] && currentMin === min[6]:
                    prayerName = 'Isha Prayer';
                    prayerDescription = '🌃 Time for Isha!';
                    break;
            }

            if (!prayerName) continue;

            const embed = new EmbedBuilder()
                .setTitle(prayerName)
                .setDescription(prayerDescription)
                .setColor(0xEB0000)
                .setTimestamp();

            const message = await channel.send({
    content: '@everyone',
    embeds: [embed],
    allowedMentions: {
        parse: ['everyone']
    }
});

            setTimeout(() => {
                message.delete().catch(console.error);
            }, 10000);
        }

    } catch (error) {
        console.error('Notifier error:', error);
    }
};

module.exports = { startNotifier };