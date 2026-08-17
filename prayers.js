const getPrayerTimes = async (city,country) => {

    city = fullNameFormmater(city);
    country = fullNameFormmater(country);

    const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`);
    const data = await response.json();
    return {timings: Object.entries(data.data.timings),
            timezone: data.data.meta.timezone
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

switch(true){

    case prayerTimingsInMin[0] > timeInMin :
        return 'next prayer is Fajr';
        break;
    case prayerTimingsInMin[2] > timeInMin :
        return 'next prayer is Dhuhur';
        break;
    case prayerTimingsInMin[3]  > timeInMin :
        return 'next prayer is Asr';
        break;
    case prayerTimingsInMin[5] > timeInMin :
        return 'next prayer is Maghrib';
        break;
    case prayerTimingsInMin[6]  > timeInMin :
        return 'next prayer is Isha';
        break;
    default:
        return 'next prayer is Fajr next day';
}


}

module.exports = {getPrayerTime,getPrayerTimes,getPrayerTimingsInMin,nextPrayerHandler};

