const fs = require('fs/promises');
const{nextPrayerHandler} = require('../../prayers.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('nextprayer').setDescription('return next prayer'),
	async execute(interaction) {
		const userId = interaction.user.id;
		try{
		const data = await fs.readFile('./data/users.json','utf-8');
		const users = JSON.parse(data);

        const user = users.find(user => user.userId === userId);

		if(user){
			await interaction.reply({embeds: [await nextPrayerHandler(user.city,user.country)]});
		}
		else{
			await interaction.reply('User not found. Please set a country and city to get next prayer');
		}
		
		}catch(error){
			console.error(error);
			await interaction.reply('Something went wrong');
		}
		
	}
};
