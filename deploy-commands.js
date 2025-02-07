const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const dotenv = require('dotenv');

dotenv.config();

const guildId = process.env.GUILDID;
const clientId = process.env.CLIENTID;
const token = process.env.TOKEN;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

    // const data = await rest.put(
    // 	Routes.applicationCommands(clientId),
    // 	{ body: commands },
    // );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
