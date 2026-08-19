const fs = require('node:fs').promises;
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('setserverlocation').setDescription('set a the server country and city for timings').addStringOption( option => 
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
           const file = await fs.readFile('./data/servers.json','utf8');
           const servers = JSON.parse(file);

           const serverExist = servers.find(savedServer => savedServer.serverId === server.serverId);
           const channelExist = servers.find(savedChannel => savedChannel.channelId === server.channelIdId);

           if(serverExist && channelExist){
            serverExist.city = server.city;
            serverExist.country = server.country;
           }else{
            servers.push(server);
           }

           await fs.writeFile('./data/servers.json',JSON.stringify(servers,null,2));
           await interaction.reply(`Location saved: ${server.city}, ${server.country}`);

        }catch(error){
            console.error(error);
            await interaction.reply('something went wrong')
        }
      
}
}

