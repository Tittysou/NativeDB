# GTA V NativeDB Discord Bot

A Discord bot that allows users to search and explore the GTA V Native Database directly from Discord. This bot provides easy access to native functions, their descriptions, and parameters using slash commands.

## Features

- 🔍 Search for native functions using fuzzy matching
- 📚 Browse natives by namespace
- 🔗 Direct links to the official NativeDB
- 🎯 Exact match prioritization
- 💡 Detailed function information including parameters and return types

## Commands

- `/search [query]` - Search for native functions
- `/namespace [namespace]` - Browse natives in a specific namespace
- `/native [hash]` - Get detailed information about a specific native function

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Tittysou/NativeDB.git
```

2. Install dependencies:
```bash
cd NativeDB
npm install
```

3. Create a `.env` file with your Discord bot token:
```env
DISCORD_TOKEN=your_bot_token_here
```

4. Start the bot:
```bash
npm start
```

## Technologies Used

- Discord.js
- Fuse.js for fuzzy searching
- Axios for API requests

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- Native function data from [alloc8or's GTA V NativeDB](https://github.com/alloc8or/gta5-nativedb-data)
- NativeDB website [Native Database](https://nativedb.dotindustries.dev/gta5/natives)