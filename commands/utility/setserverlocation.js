const pool = require('../../db');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('setserverlocation').setDescription('Set a the server country and city for timings').addStringOption( option => 
        option.setName('country').setDescription('name of the country').setRequired(true)
    ).addStringOption( option => 
        option.setName('city').setDescription('name of the city').setRequired(true)
    ),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run    

        if(interaction.guild == null){
            await interaction.reply('Not a server. Please use this command on a server')

        }

        let server = {
            serverId: interaction.guild.id,
            channelId: interaction.channel.id,
            city: interaction.options.getString('city'),
            country: interaction.options.getString('country'),
            notifications: false
        };

      

        try{
      
           const serverExist = await pool.query(`SELECT server_id FROM servers WHERE server_id = $1 AND channel_id = $2 `,[interaction.guild.id,interaction.channel.id]);

           if(serverExist.rows.length>0){
            await pool.query(`UPDATE servers SET city = $1 , country = $2 WHERE server_id = $3 AND channel_id = $4`,[server.city,server.country,server.serverId, server.channelId]);
           }else{
           await pool.query(`INSERT INTO servers (server_id, city, country, channel_id, notifications)
            VALUES ($1, $2, $3, $4, $5)`,[server.serverId,server.city,server.country,server.channelId,server.notifications]);
           }
           await interaction.reply(`Location saved: ${server.city}, ${server.country}`);

        }catch(error){
            console.error(error);
            await interaction.reply('something went wrong')
        }
      
}
}

           