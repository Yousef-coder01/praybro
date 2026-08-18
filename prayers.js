const { EmbedBuilder} = require('discord.js');


const getPrayerTimes = async (city,country) => {

    city = fullNameFormmater(city);
    country = fullNameFormmater(country);

    const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`);
    const data = await response.json();
    return {timings: Object.entries(data.data.timings),
            timezone: data.data.meta.timezone,
            city,
            country
    };
};

const fullNameFormmater = (place) => {

place = place.toLowerCase();
place = place.split(' ');

const fullName = place.map((name) =>{
 return name.charAt(0).toUpperCase()+name.slice(1);

    });
    
return fullName.join(" ");
};

const getPrayerTime = async (name,city,country) =>{

const data = await getPrayerTimes(city,country);
const prayerTimings = data.timings;

const prayer = prayerTimings.find(([key]) => key === name);

let time = prayer[1];
time = time.split(':');

const hrs = parseInt(time[0]); 
const min = parseInt(time[1]);

return {hrs, min};
};

const getPrayerTimingsInMin = async (city,country) =>{

    const data = await getPrayerTimes(city,country);
    const prayerTimings = data.timings;

    const prayers = prayerTimings.map((element) => element.splice(1,1)).splice(0,7);

    const hrs = prayers.map(element => parseInt(element[0].split(':')[0]));

    const min = prayers.map(element => parseInt(element[0].split(':')[1]));

    return{
        timeInMin: hrs.map((num,idx) => num*60+min[idx]),
        timezone: data.timezone
    };
    
};



const nextPrayerHandler = async (city,country) => {

 const data =  await getPrayerTimingsInMin(city,country);
 const prayers = await getPrayerTimes(city,country);
 const prayerTimings = prayers.timings;
 city = prayers.city
 country = prayers.country;





  const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: data.timezone,
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

    const timeInMin = currentHrs * 60 + currentMin;

    const prayerTimingsInMin = data.timeInMin;

    const embed = new EmbedBuilder();
    
switch(true){

    case prayerTimingsInMin[0] > timeInMin :
        return embed.setTitle('Next Prayer').addFields({name:`🌄 ${prayerTimings[0][0]}`, value:`⏰ ${prayerTimings[0][1]}`}).setFooter({text:`📍 ${city}, ${country}`}).setColor(0x37589E);
    case prayerTimingsInMin[2] > timeInMin :
        return  embed.setTitle('Next Prayer').addFields({name:`☀️ ${prayerTimings[2][0]}`, value:`⏰ ${prayerTimings[2][1]}`}).setFooter({text:`📍 ${city}, ${country}`}).setColor(0xFFC938);
        break;
    case prayerTimingsInMin[3]  > timeInMin :
        return  embed.setTitle('Next Prayer').addFields({name:`☀️ ${prayerTimings[3][0]}`, value:`⏰ ${prayerTimings[3][1]}`}).setFooter({text:`📍 ${city}, ${country}`}).setColor(0xFFC938);
        break;
    case prayerTimingsInMin[5] > timeInMin :
        return  embed.setTitle('Next Prayer').addFields({name:`🌆 ${prayerTimings[5][0]}`, value:`⏰ ${prayerTimings[5][1]}`}).setFooter({text:`📍 ${city}, ${country}`}).setColor(0xA13251);     
        break;
    case prayerTimingsInMin[6]  > timeInMin :
        return  embed.setTitle('Next Prayer').addFields({name:`🌃 ${prayerTimings[6][0]}`, value:`⏰ ${prayerTimings[6][1]}`}).setFooter({text:`📍 ${city}, ${country}`}).setColor(0x22047D);;
        break;
    default:
        return embed.setTitle('Next Prayer').addFields({name:`🌄 ${prayerTimings[0][0]- tommorow}`, value:`⏰ ${prayerTimings[0][1]}`}).setFooter({text:`📍 ${city}, ${country}`}).setColor(0x37589E);;


}
}


const prayerTimes = async (city,country) =>{
const ptimings = await getPrayerTimes(city,country);
 timings = ptimings.timings;
 timings.splice(7,4);

const embed = new EmbedBuilder()
    .setTitle('Prayer Times')
    .setDescription(`📍${ptimings.city}, ${ptimings.country}\n`)
    .addFields(
        { name: '🌅 Fajr', value: timings[0][1], inline: false },
        { name: '☀️ Dhuhr', value: timings[2][1], inline: false },
        { name: '🌤️ Asr', value: timings[3][1], inline: false },
        { name: '🌇 Maghrib', value: timings[5][1], inline: false },
        { name: '🌙 Isha', value: timings[6][1], inline: false }
    )
    .setTimestamp();

    return embed;
}


module.exports = {getPrayerTimes,getPrayerTime,getPrayerTimingsInMin,nextPrayerHandler,prayerTimes};

const embed = new EmbedBuilder().set