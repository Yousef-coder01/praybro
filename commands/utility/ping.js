const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};


//The data property, which will provide the command definition shown above for registering to Discord.
//The execute method, which will contain the functionality to run from our event handler when the command is used.


// module.exports is how you export data in Node.js so that you can require() it in other files.

/*
If you need to access your client instance from inside a command file, 
you can access it via interaction.client. 
If you need to access external files, packages, etc., 
you should require() them at the top of the file.
*/

console.log(module);