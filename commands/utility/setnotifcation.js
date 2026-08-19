const fs = require('fs/promises');
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder().setName('setnotification').setDescription('turn on/off prayer notification')
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
        const file = await fs.readFile('./data/servers.json','utf-8');
        const servers = JSON.parse(file);

        const serverExist = servers.find(savedServer => savedServer.serverId === interaction.guild.id);


           if(serverExist &&  serverExist.channelId === interaction.channel.id){
            serverExist.notifications = on;

           await fs.writeFile('./data/servers.json',JSON.stringify(servers,null,2));
           await interaction.reply(`notfication is ${on?'ON':'OFF'}`);
          
           }else{
            await interaction.reply('server or channel location is not set yet');
           }
       
        }catch(error){
            console.error(error);
            await interaction.reply('something went wrong');
        }

		
	},
};
