const pool = require('../../db');
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder().setName('setnotification').setDescription('Turn on/off prayer notification')
    .addStringOption(option =>
    option
        .setName('status')
        .setDescription('Turn prayer notifications on or off')
        .setRequired(true)
        .addChoices(
            { name: 'On', value: 'on' },
            { name: 'Off', value: 'off' }
        )
),
	async execute(interaction) {
        const status = interaction.options.getString('status');
        const on = status === 'on';

        try{
  
        const serverExist = await pool.query(`SELECT server_id FROM servers WHERE server_id = $1 AND channel_id = $2 `,[interaction.guild.id,interaction.channel.id]);
        

           if(serverExist.rows.length>0){
            await pool.query(`UPDATE servers SET notifications = $1 WHERE server_id = $2 AND channel_id = $3`,[on, interaction.guild.id, interaction.channel.id]);
            await interaction.reply(`Notifications are ${on ? 'on' : 'off'}`);
           }else{
           await interaction.reply('server or channel location is not set yet')
       
        }
        
    }catch(error){
            console.error(error);
            await interaction.reply('something went wrong');
        }

		
	
}
};
