// commands/namespace.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { searchByNamespace } = require('../utils/scraper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('namespace')
    .setDescription('Search natives by namespace')
    .addStringOption(option => 
      option.setName('namespace')
        .setDescription('The namespace to search in (e.g., PLAYER, VEHICLE)')
        .setRequired(true)),
        
  async execute(interaction) {
    await interaction.deferReply();
    const namespace = interaction.options.getString('namespace').toUpperCase();
    
    try {
      const results = await searchByNamespace(namespace);
      
      if (results.length === 0) {
        const embed = new EmbedBuilder()
          .setDescription(`> No results found for namespace "${namespace}".`)
          .setColor("#1abb4d");
        
        return await interaction.editReply({ embeds: [embed] });
      }
      
      // Create embed for results
      const embed = new EmbedBuilder()
        .setTitle(`Natives in "${namespace}" Namespace`)
        .setColor("#1abb4d")
        .setFooter({ text: 'GTA Natives Database' });
      
      let description = '';
      results.forEach((result, index) => {
        description += `**${index + 1}. [${result.name}](${result.link})**\n`;
        description += `> Description: ${result.description || 'No description available'}\n\n`;
      });
      
      if (results.length >= 5) {
        description += `*Showing first 5 results. For more results, visit the website directly.*`;
      }
      
      embed.setDescription(description);
      
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setDescription(`> An error occurred while searching for natives in namespace "${namespace}".`)
        .setColor("#ff0000");
      
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};