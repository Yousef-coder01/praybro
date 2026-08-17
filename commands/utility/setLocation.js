const fs = require('node:fs').promises;
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('setlocation').setDescription('set a country and city for timings').addStringOption( option => 
        option.setName('country').setDescription('name of the country').setRequired(true)
    ).addStringOption( option => 
        option.setName('city').setDescription('name of the city').setRequired(true)
    ),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run    
        let user = {
            userId: interaction.user.id,
            city: interaction.options.getString('city'),
            country: interaction.options.getString('country')
        };

        try{
           const file = await fs.readFile('./data/users.json','utf8');
           const users = JSON.parse(file);

           const userExist = users.find(savedUser => savedUser.userId === user.userId);

           if(userExist){
            userExist.city = user.city;
            userExist.country = user.country;
           }else{
            users.push(user);
           }

           await fs.writeFile('./data/users.json',JSON.stringify(users,null,2));
           await interaction.reply(`Location saved: ${user.city}, ${user.country}`);

        }catch(error){
            console.error(error);
            await interaction.reply('something went wrong')
        }
      
}
}

