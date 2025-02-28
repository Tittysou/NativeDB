const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with using the GTA natives bot'),
        
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('GTA Natives Search Bot Help')
      .setDescription(`> This bot allows you to search for GTA V native functions from the NativeDB website.`)
      .addFields(
        { 
          name: 'Commands', 
          value: `> \`/search [query]\` - Search for GTA natives by name or description
> \`/namespace [namespace]\` - Search for natives in a specific namespace
> \`/help\` - Display this help message` 
        },
        { 
          name: 'Examples', 
          value: `> \`/search player\` - Search for natives related to players
> \`/search SET_ENTITY_COORDS\` - Search for a specific native function
> \`/namespace VEHICLE\` - Show natives in the VEHICLE namespace` 
        },
        {
          name: 'Source',
          value: '> Data is sourced from https://nativedb.dotindustries.dev/gta5/natives'
        }
      )
      .setColor('#1abb4d')
      .setFooter({ text: 'GTA Natives Database' });
    
    await interaction.reply({ embeds: [embed] });
  },
};