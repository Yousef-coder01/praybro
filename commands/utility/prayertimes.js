const { EmbedBuilder} = require('discord.js');
const{prayerTimes} = require('../../prayers.js');
const fs = require('fs/promises');

const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder().setName('prayertimes').setDescription('provides prayer times'),
    async execute(interaction) {
       const userId = interaction.user.id;
		try{
		const data = await fs.readFile('./data/users.json','utf-8');
		const users = JSON.parse(data);

        const user = users.find(user => user.userId === userId);

		if(user){
			await interaction.reply({ embeds : [await prayerTimes(user.city,user.country)]});
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
