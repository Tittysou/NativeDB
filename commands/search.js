const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { searchNatives } = require('../utils/scraper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for GTA natives')
    .addStringOption(option => 
      option.setName('query')
        .setDescription('The native function or term to search for')
        .setRequired(true)),
        
  async execute(interaction) {
    await interaction.deferReply();
    const query = interaction.options.getString('query');
    
    try {
      console.log(`Executing search for query: "${query}"`);
      const results = await searchNatives(query);
      
      if (results.length === 0) {
        const embed = new EmbedBuilder()
          .setDescription(`> No results found for "${query}".`)
          .setColor("#1abb4d");
        
        return await interaction.editReply({ embeds: [embed] });
      }
      
      const embed = new EmbedBuilder()
        .setTitle(`Search Results for "${query}"`)
        .setColor("#1abb4d")
        .setFooter({ text: 'GTA Natives Database' });
      
      let description = '';
      results.forEach((result, index) => {
        description += `**${index + 1}. [${result.name}](${result.link})**\n`;
        if (result.namespace) {
          description += `> Namespace: \`${result.namespace}\`\n`;
        }
        description += `> Hash: \`${result.hash}\`\n`;
        if (result.description) {
          const desc = result.description.length > 100 
            ? result.description.substring(0, 100) + '...' 
            : result.description;
          description += `> Description: ${desc}\n`;
        }
        description += '\n';
      });
      
      if (results.length >= 10) {
        description += `*Showing first 10 results. For more results, please refine your search query or visit the website directly.*`;
      }
      
      embed.setDescription(description);
      
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('Visit NativeDB Website')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://nativedb.dotindustries.dev/gta5/natives?search=${encodeURIComponent(query)}`)
        );
      
      await interaction.editReply({ 
        embeds: [embed],
        components: [row]
      });
      
    } catch (error) {
      console.error('Search command error:', error);
      const errorEmbed = new EmbedBuilder()
        .setDescription(`> An error occurred while searching for natives. Please try again later or check the search term.`)
        .setColor("#ff0000");
      
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};