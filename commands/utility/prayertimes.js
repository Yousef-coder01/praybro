const pool = require('../../db.js');
const { EmbedBuilder} = require('discord.js');
const{prayerTimes} = require('../../prayers.js');


const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder().setName('prayertimes').setDescription('Provides prayer times'),
    async execute(interaction) {

       const userId = interaction.user.id;

		try{
			
		 const user = await pool.query(`SELECT user_id, city, country FROM users WHERE user_id = $1`,[userId]);
		 const {city , country} = user.rows[0];

		if(user.rows.length > 0){
			await interaction.reply({ embeds: [await prayerTimes(city,country)]});
		}
		else{
			await interaction.reply('User not found. Please set a country and city to get next prayer');
		}
		
		}catch(error){
			console.error(error);
			await interaction.reply('Something went wrong');
		}
    },
};
