const pool = require('../../db');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('setlocation').setDescription('Set a country and city for timings').addStringOption( option => 
        option.setName('country').setDescription('name of the country').setRequired(true)
    ).addStringOption( option => 
        option.setName('city').setDescription('name of the city').setRequired(true)
    ),
	async execute(interaction) {
		  
   
            const userId = interaction.user.id;
            const city = interaction.options.getString('city');
            const country = interaction.options.getString('country');
       

        try{
    
            const userExist = await pool.query(`SELECT user_id FROM users WHERE user_id = $1`,[userId]);

           
           if(userExist.rows.length>0){
            await pool.query(`UPDATE users SET city = $1  , country = $2 WHERE user_id = $3`,[city,country,userId]);
           }else{
            await pool.query(`INSERT INTO users (user_id, city, country)
            VALUES ($1, $2, $3)`,[userId,city,country]);
           }

           await interaction.reply(`Location saved: ${city}, ${country}`);

        }catch(error){
            console.error(error);
            await interaction.reply('something went wrong')
        }
      
}
}

